/**
 * Vercel Plugin for Ship Studio
 *
 * Provides Vercel deployment integration via the toolbar slot.
 * Uses the invoke proxy to call Tauri Vercel commands.
 */
import { useState, useRef, useEffect } from 'react';

// ============ SDK access via window globals ============

interface PluginContext {
  pluginId: string;
  project: { name: string; path: string; currentBranch: string } | null;
  actions: {
    showToast: (msg: string, type?: 'success' | 'error') => void;
    openUrl: (url: string) => void;
  };
  invoke: { call: <T = unknown>(cmd: string, args?: Record<string, unknown>) => Promise<T> };
}

function getCtx(): PluginContext {
  const ctx = (window as Record<string, unknown>).__SHIPSTUDIO_PLUGIN_CONTEXT__ as
    | PluginContext
    | undefined;
  if (!ctx) throw new Error('Plugin context not available');
  return ctx;
}

// ============ Types (mirrored from host) ============

interface VercelCliStatus {
  installed: boolean;
  authenticated: boolean;
}

interface ProjectVercelStatus {
  status: 'not-linked' | 'not-git-connected' | 'connected';
  project_name: string | null;
  vercel_org: string | null;
  production_url: string | null;
  staging_url: string | null;
}

interface VercelTeam {
  id: string;
  name: string;
  is_current: boolean;
}

interface VercelProject {
  id: string;
  name: string;
  orgId: string;
}

// ============ Toolbar component ============

function VercelToolbar() {
  const ctx = getCtx();
  const project = ctx.project;
  const invoke = ctx.invoke;
  const toast = ctx.actions.showToast;
  const openUrl = ctx.actions.openUrl;

  const [cliStatus, setCliStatus] = useState<VercelCliStatus | null>(null);
  const [projectStatus, setProjectStatus] = useState<ProjectVercelStatus | null>(null);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [showSiteDropdown, setShowSiteDropdown] = useState(false);
  const [deployName, setDeployName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [teams, setTeams] = useState<VercelTeam[]>([]);
  const [selectedScope, setSelectedScope] = useState<string | undefined>(undefined);
  const [isLoadingTeams, setIsLoadingTeams] = useState(false);
  const [linkMode, setLinkMode] = useState<'new' | 'existing'>('new');
  const [existingProjects, setExistingProjects] = useState<VercelProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [optimisticLinked, setOptimisticLinked] = useState(false);
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check CLI status on mount and when project changes
  useEffect(() => {
    void checkStatus();
    return () => {
      if (pollRef.current) clearTimeout(pollRef.current);
    };
  }, [project?.path]);

  const checkStatus = async () => {
    try {
      const status = await invoke.call<VercelCliStatus>('check_vercel_cli_status');
      setCliStatus(status);

      if (status.authenticated && project?.path) {
        const vs = await invoke
          .call<ProjectVercelStatus>('get_project_vercel_status', {
            projectPath: project.path,
          })
          .catch(
            (): ProjectVercelStatus => ({
              status: 'not-linked',
              project_name: null,
              vercel_org: null,
              production_url: null,
              staging_url: null,
            })
          );
        setProjectStatus(vs);
      }
    } catch {
      // CLI not available
      setCliStatus({ installed: false, authenticated: false });
    }
  };

  // Don't render anything if CLI status hasn't been checked yet
  if (!cliStatus) return null;

  // Don't show unless we have a project open
  if (!project) return null;

  // ---- Install CLI ----
  if (!cliStatus.installed) {
    return (
      <button
        className="vercel-button vercel-install"
        onClick={async () => {
          setIsInstalling(true);
          try {
            await invoke.call('install_vercel_cli');
            toast('Vercel CLI installed!', 'success');
            await checkStatus();
          } catch (e) {
            toast('Failed to install Vercel CLI', 'error');
          } finally {
            setIsInstalling(false);
          }
        }}
        disabled={isInstalling}
        title="Install Vercel CLI via npm"
      >
        <VercelIcon />
        {isInstalling ? 'Installing...' : 'Install Vercel'}
      </button>
    );
  }

  // ---- Not authenticated ----
  if (!cliStatus.authenticated) {
    return (
      <button
        className="vercel-button vercel-connect"
        title="Connect your Vercel account"
        onClick={() => toast('Run "vercel login" in the terminal to connect', 'success')}
      >
        <VercelIcon />
        Connect Vercel
      </button>
    );
  }

  // ---- Deploying ----
  if (isDeploying) {
    return (
      <button className="vercel-button vercel-deploying" disabled title="Deploying to Vercel...">
        <VercelIcon />
        <span className="deploying-text">Deploying...</span>
      </button>
    );
  }

  // ---- Connected: show dashboard link + site dropdown ----
  if (projectStatus?.status === 'connected') {
    const dashboardUrl =
      projectStatus.vercel_org && projectStatus.project_name
        ? `https://vercel.com/${projectStatus.vercel_org}/${projectStatus.project_name}`
        : 'https://vercel.com/dashboard';
    const productionUrl = projectStatus.production_url;
    const branch = project.currentBranch || 'main';
    const isMainBranch = branch === 'main' || branch === 'master';
    const previewUrl =
      !isMainBranch && projectStatus.project_name
        ? `${projectStatus.project_name}-git-${branch.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.vercel.app`
        : null;
    const hasUrls = productionUrl || previewUrl;

    return (
      <div
        className="vercel-button-container"
        onMouseEnter={() => hasUrls && setShowSiteDropdown(true)}
        onMouseLeave={() => setShowSiteDropdown(false)}
      >
        <button
          className="vercel-button vercel-linked"
          onClick={() => openUrl(dashboardUrl)}
          title="Open Vercel dashboard"
        >
          <VercelIcon />
        </button>

        {showSiteDropdown && hasUrls && (
          <div className="vercel-site-dropdown">
            <div className="vercel-site-dropdown-inner">
              {productionUrl && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openUrl(`https://${productionUrl}`);
                  }}
                >
                  <span className="vercel-site-badge vercel-site-badge-prod">Prod</span>
                  <span className="vercel-site-url">{productionUrl}</span>
                  <ExternalLinkIcon />
                </button>
              )}
              {previewUrl && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openUrl(`https://${previewUrl}`);
                  }}
                >
                  <span className="vercel-site-badge vercel-site-badge-preview">Preview</span>
                  <span className="vercel-site-url">{previewUrl}</span>
                  <ExternalLinkIcon />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ---- Still checking status ----
  if (projectStatus === null) {
    return (
      <button className="vercel-button vercel-checking" disabled title="Checking Vercel status...">
        <VercelIcon />
        <span className="checking-text">Connecting...</span>
      </button>
    );
  }

  // ---- Optimistic linked state ----
  if (optimisticLinked) {
    return (
      <button className="vercel-button vercel-linked" disabled title="Connected to Vercel">
        <VercelIcon />
      </button>
    );
  }

  // ---- Helper functions ----
  const loadExistingProjects = async (scope: string | undefined) => {
    setIsLoadingProjects(true);
    setSelectedProjectId('');
    try {
      const projects = await invoke.call<VercelProject[]>('list_vercel_projects', {
        scope: scope || '',
      });
      setExistingProjects(projects);
    } catch {
      setExistingProjects([]);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const handleDeploy = async () => {
    if (!deployName.trim()) return;
    setIsDeploying(true);
    setError(null);
    try {
      await invoke.call<string>('deploy_to_vercel', {
        options: {
          projectPath: project.path,
          projectName: deployName,
          scope: selectedScope,
        },
      });
      setShowDeployModal(false);
      toast('Connected to Vercel!', 'success');
      await checkStatus();
    } catch (e) {
      setError(String(e));
    } finally {
      setIsDeploying(false);
    }
  };

  const handleLinkExisting = async () => {
    const proj = existingProjects.find((p) => p.id === selectedProjectId);
    if (!proj) return;
    setIsLinking(true);
    setError(null);
    try {
      await invoke.call('write_vercel_project_json', {
        projectPath: project.path,
        projectId: proj.id,
        orgId: proj.orgId,
        projectName: proj.name,
      });
      setShowDeployModal(false);
      setOptimisticLinked(true);
      toast('Linked to Vercel project!', 'success');
      await checkStatus();
    } catch (e) {
      setError(String(e));
    } finally {
      setIsLinking(false);
    }
  };

  const handleOpenDeployModal = async () => {
    setDeployName(project.name);
    setShowDeployModal(true);
    setError(null);
    setLinkMode('new');
    setExistingProjects([]);
    setSelectedProjectId('');
    setIsLoadingTeams(true);

    try {
      const fetchedTeams = await invoke.call<VercelTeam[]>('get_vercel_teams');
      setTeams(fetchedTeams);
      const currentTeam = fetchedTeams.find((t) => t.is_current);
      setSelectedScope(currentTeam ? currentTeam.id : undefined);
    } catch {
      setTeams([]);
      setSelectedScope(undefined);
    } finally {
      setIsLoadingTeams(false);
    }
  };

  // ---- Not linked: show Connect button ----
  return (
    <>
      <button
        className="vercel-button vercel-setup"
        onClick={() => void handleOpenDeployModal()}
        title="Connect to Vercel for auto-deployments"
      >
        <VercelIcon />
        Connect Vercel
      </button>

      {showDeployModal && (
        <div
          className="modal-overlay"
          onClick={() => {
            if (!isDeploying) setShowDeployModal(false);
          }}
        >
          <div className="modal vercel-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Connect to Vercel</h3>
            <p>Link this project to Vercel for automatic deployments when you publish.</p>

            <div className="vercel-link-mode-toggle">
              <button
                className={linkMode === 'new' ? 'active' : ''}
                onClick={() => setLinkMode('new')}
              >
                Create new project
              </button>
              <button
                className={linkMode === 'existing' ? 'active' : ''}
                onClick={() => {
                  setLinkMode('existing');
                  if (existingProjects.length === 0) {
                    void loadExistingProjects(selectedScope);
                  }
                }}
              >
                Link existing project
              </button>
            </div>

            <div className="vercel-form">
              {isLoadingTeams ? (
                <div className="vercel-form-loading">
                  <div className="vercel-form-spinner" />
                  <span>Loading teams...</span>
                </div>
              ) : (
                teams.length > 0 && (
                  <label>
                    Team
                    <select
                      className="owner-select"
                      value={selectedScope || ''}
                      onChange={(e) => {
                        const newScope = e.target.value || undefined;
                        setSelectedScope(newScope);
                        if (linkMode === 'existing') {
                          void loadExistingProjects(newScope);
                        }
                      }}
                    >
                      <option value="">Personal Account</option>
                      {teams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </label>
                )
              )}

              {linkMode === 'new' ? (
                <label>
                  Vercel project name
                  <input
                    type="text"
                    value={deployName}
                    onChange={(e) =>
                      setDeployName(e.target.value.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase())
                    }
                    placeholder="my-project"
                    autoFocus
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                  />
                </label>
              ) : (
                <>
                  {isLoadingProjects ? (
                    <div className="vercel-form-loading">
                      <div className="vercel-form-spinner" />
                      <span>Loading projects...</span>
                    </div>
                  ) : existingProjects.length === 0 ? (
                    <div className="vercel-form-empty">No projects found for this scope</div>
                  ) : (
                    <label>
                      Select project
                      <select
                        className="owner-select"
                        value={selectedProjectId}
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                      >
                        <option value="">Choose a project...</option>
                        {existingProjects.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                </>
              )}

              {error && <p className="vercel-error">{error}</p>}
            </div>

            <div className="modal-actions">
              <button onClick={() => setShowDeployModal(false)} disabled={isDeploying || isLinking}>
                Cancel
              </button>
              {linkMode === 'new' ? (
                <button
                  className="btn-primary"
                  onClick={() => void handleDeploy()}
                  disabled={isDeploying || !deployName.trim()}
                >
                  {isDeploying ? 'Connecting...' : 'Connect & Deploy'}
                </button>
              ) : (
                <button
                  className="btn-primary"
                  onClick={() => void handleLinkExisting()}
                  disabled={isLinking || !selectedProjectId}
                >
                  {isLinking ? 'Linking...' : 'Link Project'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ============ Icons ============

function VercelIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 116 100" fill="currentColor">
      <path d="M57.5 0L115 100H0L57.5 0Z" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

// ============ Plugin exports ============

export const name = 'Vercel';

export const slots: Record<string, React.ComponentType> = {
  toolbar: VercelToolbar,
};
