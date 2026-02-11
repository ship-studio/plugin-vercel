/**
 * Vercel Plugin for Ship Studio
 *
 * Provides Vercel deployment integration via the toolbar slot.
 * Uses shell.exec() to call Vercel CLI directly.
 */
import { useState, useRef, useEffect } from 'react';

// ============ CSS injection ============

const VERCEL_CSS = `
/* Vercel Integration - Workspace Header */
.vercel-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 6px 10px;
  min-height: 32px;
  font-size: 13px;
  border-radius: 6px;
  border: 1px solid var(--border);
  transition: all 0.15s;
}

.vercel-button svg {
  flex-shrink: 0;
}

.vercel-button.vercel-install,
.vercel-button.vercel-connect {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
}

.vercel-button.vercel-install:hover,
.vercel-button.vercel-connect:hover {
  background: var(--border);
  color: var(--text-primary);
}

.vercel-button.vercel-linked {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
}

.vercel-button.vercel-linked:hover {
  background: var(--border);
  border-color: var(--text-muted);
}

.vercel-button.vercel-linked svg {
  color: var(--text-muted);
}

.vercel-button.vercel-linked:hover svg {
  color: var(--text-secondary);
}

.vercel-button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.vercel-error {
  color: var(--error);
  font-size: 12px;
  margin-left: 8px;
}

/* Vercel Modal */
.vercel-modal {
  max-width: 480px;
}

/* Link mode toggle */
.vercel-link-mode-toggle {
  display: flex;
  margin-top: 16px;
  border-bottom: 1px solid var(--border);
  gap: 0;
}

.vercel-link-mode-toggle button {
  flex: 1;
  padding: 10px 12px;
  font-size: 13px;
  font-weight: 500;
  border: none;
  border-radius: 0;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  transition: color 0.15s;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
}

.vercel-link-mode-toggle button:hover {
  color: var(--text-secondary);
  background: transparent;
}

.vercel-link-mode-toggle button.active {
  color: var(--text-primary);
  border-bottom-color: var(--text-primary);
  background: transparent;
}

/* Loading spinner */
.vercel-form-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 24px 16px;
  color: var(--text-muted);
  font-size: 13px;
}

.vercel-form-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--border);
  border-top-color: var(--text-muted);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.vercel-form-empty {
  padding: 24px 16px;
  text-align: center;
  color: var(--text-muted);
  font-size: 13px;
}

.vercel-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
}

.vercel-form label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  color: var(--text-secondary);
}

.vercel-form input {
  padding: 10px 12px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text-primary);
  font-size: 14px;
  outline: none;
}

.vercel-form input:focus {
  border-color: var(--accent);
}

.vercel-form .vercel-error {
  margin-left: 0;
  margin-top: 12px;
  padding: 12px;
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.5;
  white-space: pre-wrap;
}

.vercel-button.vercel-deploying {
  background: #000;
  color: #fff;
  cursor: wait;
}

.vercel-button.vercel-deploying .deploying-text {
  animation: deployPulse 1.5s ease-in-out infinite;
}

@keyframes deployPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.vercel-button.vercel-setup {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
}

.vercel-button.vercel-setup:hover {
  background: var(--border);
  color: var(--text-primary);
}

.vercel-button.vercel-checking {
  background: var(--bg-tertiary);
  color: var(--text-muted);
  cursor: wait;
}

.vercel-button.vercel-checking .checking-text {
  animation: deployPulse 1.5s ease-in-out infinite;
}

/* Vercel Site Dropdown */
.vercel-button-container {
  position: relative;
}

.vercel-site-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  padding-top: 4px;
  z-index: 100;
}

.vercel-site-dropdown-inner {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 4px;
  min-width: 200px;
  max-width: 320px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.vercel-site-dropdown-inner button {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 12px;
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 13px;
  cursor: pointer;
  border-radius: 6px;
  text-align: left;
}

.vercel-site-dropdown-inner button:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.vercel-site-badge {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  padding: 3px 6px;
  border-radius: 4px;
  flex-shrink: 0;
}

.vercel-site-badge-prod {
  color: rgba(74, 222, 128, 0.9);
  background: rgba(74, 222, 128, 0.12);
}

.vercel-site-badge-preview {
  color: rgba(96, 165, 250, 0.9);
  background: rgba(96, 165, 250, 0.12);
}

.vercel-site-url {
  flex: 1;
  min-width: 0;
  font-family: monospace;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vercel-site-dropdown-inner button svg {
  flex-shrink: 0;
  opacity: 0.5;
}

.vercel-site-dropdown-inner button:hover svg {
  opacity: 1;
}
`;

// ============ SDK access via window globals ============

interface PluginContext {
  pluginId: string;
  project: { name: string; path: string; currentBranch: string } | null;
  actions: {
    showToast: (msg: string, type?: 'success' | 'error') => void;
    openUrl: (url: string) => void;
  };
  shell: {
    exec: (
      command: string,
      args: string[]
    ) => Promise<{ stdout: string; stderr: string; exit_code: number }>;
  };
}

function getCtx(): PluginContext {
  const ctx = (window as Record<string, unknown>).__SHIPSTUDIO_PLUGIN_CONTEXT__ as
    | PluginContext
    | undefined;
  if (!ctx) throw new Error('Plugin context not available');
  return ctx;
}

// ============ Types ============

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
  const shell = ctx.shell;
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

  // Inject CSS on mount, remove on unmount
  useEffect(() => {
    const style = document.createElement('style');
    style.setAttribute('data-vercel-plugin', 'true');
    style.textContent = VERCEL_CSS;
    document.head.appendChild(style);
    return () => {
      style.remove();
    };
  }, []);

  // Check CLI status on mount and when project changes
  useEffect(() => {
    void checkStatus();
    return () => {
      if (pollRef.current) clearTimeout(pollRef.current);
    };
  }, [project?.path]);

  const checkStatus = async () => {
    try {
      // Check if vercel CLI is installed
      const versionResult = await shell.exec('vercel', ['--version']);
      const installed = versionResult.exit_code === 0;

      if (!installed) {
        setCliStatus({ installed: false, authenticated: false });
        return;
      }

      // Check if authenticated
      const whoamiResult = await shell.exec('vercel', ['whoami']);
      const authenticated = whoamiResult.exit_code === 0;

      setCliStatus({ installed: true, authenticated });

      if (authenticated && project?.path) {
        // Read .vercel/project.json to check link status
        const catResult = await shell.exec('cat', ['.vercel/project.json']);
        if (catResult.exit_code !== 0) {
          setProjectStatus({
            status: 'not-linked',
            project_name: null,
            vercel_org: null,
            production_url: null,
            staging_url: null,
          });
          return;
        }

        try {
          const projectJson = JSON.parse(catResult.stdout);
          const projectId = projectJson.projectId;
          const orgId = projectJson.orgId;

          if (!projectId || !orgId) {
            setProjectStatus({
              status: 'not-linked',
              project_name: null,
              vercel_org: null,
              production_url: null,
              staging_url: null,
            });
            return;
          }

          let projectName: string | null = projectJson.projectName || null;
          let productionUrl: string | null = null;
          let vercelOrg: string | null = null;

          // Get deployment info + org slug from vercel ls (text output)
          // Text header contains "under <scope-slug>" which gives us the dashboard org
          const lsTextResult = await shell.exec('vercel', ['ls', '--no-color']).catch(() => null);
          if (lsTextResult && lsTextResult.exit_code === 0) {
            const lines = lsTextResult.stdout.split('\n');
            for (const line of lines) {
              // Header line: "> Deployments for <project> under <scope> [time]"
              // or "> N deployments found under <scope> [time]"
              const scopeMatch = line.match(/under\s+(\S+)/);
              if (scopeMatch) {
                vercelOrg = scopeMatch[1];
              }
              // Also try to get project name from header
              const projMatch = line.match(/Deployments?\s+for\s+(\S+)/);
              if (projMatch && !projectName) {
                projectName = projMatch[1];
              }
            }
          }

          // Try vercel ls --json for production URL
          const lsJsonResult = await shell.exec('vercel', ['ls', '--json']).catch(() => null);
          if (lsJsonResult && lsJsonResult.exit_code === 0) {
            try {
              const lsData = JSON.parse(lsJsonResult.stdout);
              const deployments = lsData.deployments || (Array.isArray(lsData) ? lsData : []);
              if (deployments.length > 0) {
                const dep = deployments[0];
                if (!projectName) projectName = dep.name || null;
                if (dep.alias && dep.alias.length > 0) {
                  productionUrl = dep.alias[0];
                } else if (dep.url) {
                  productionUrl = dep.url;
                }
                // Fallback: extract org from inspectorUrl if text parsing missed it
                if (!vercelOrg && dep.inspectorUrl) {
                  const match = String(dep.inspectorUrl).match(/vercel\.com\/([^/]+)\//);
                  if (match) vercelOrg = match[1];
                }
              }
            } catch {
              // ignore parse errors
            }
          }

          setProjectStatus({
            status: 'connected',
            project_name: projectName,
            vercel_org: vercelOrg,
            production_url: productionUrl,
            staging_url: null,
          });
        } catch {
          setProjectStatus({
            status: 'not-linked',
            project_name: null,
            vercel_org: null,
            production_url: null,
            staging_url: null,
          });
        }
      }
    } catch {
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
            // Try brew first, fallback to npm
            const brewResult = await shell.exec('brew', ['install', 'vercel-cli']);
            if (brewResult.exit_code !== 0) {
              const npmResult = await shell.exec('npm', ['install', '-g', 'vercel']);
              if (npmResult.exit_code !== 0) {
                throw new Error('Failed to install via brew and npm');
              }
            }
            toast('Vercel CLI installed!', 'success');
            await checkStatus();
          } catch {
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
      // Use text output — --json returns IDs instead of names
      const args = ['project', 'ls', '--no-color'];
      if (scope) {
        args.push('--scope', scope);
      }
      const result = await shell.exec('vercel', args);
      if (result.exit_code !== 0) {
        setExistingProjects([]);
        return;
      }

      const orgId = scope || 'personal';
      const projects: VercelProject[] = [];
      const lines = result.stdout.split('\n');
      let headerPassed = false;

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        // Skip separator line (dashes), marks end of header
        if (trimmed.includes('───')) {
          headerPassed = true;
          continue;
        }
        if (!headerPassed) continue;
        // Parse table row — first column is project name
        const parts = trimmed.split(/\s{2,}/);
        const name = parts[0]?.trim();
        if (name && !name.startsWith('>')) {
          projects.push({ id: name, name, orgId });
        }
      }

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
    setShowDeployModal(false);
    setError(null);
    try {
      // Step 1: Link the project (fast, <30s)
      const linkArgs = ['link', '--yes', '--project', deployName.trim()];
      if (selectedScope) {
        linkArgs.push('--scope', selectedScope);
      }
      const linkResult = await shell.exec('vercel', linkArgs);
      if (linkResult.exit_code !== 0) {
        throw new Error(linkResult.stderr || 'Failed to link project');
      }

      // Step 2: Attempt production deploy (may timeout at 30s)
      const deployArgs = ['--prod', '--yes'];
      if (selectedScope) {
        deployArgs.push('--scope', selectedScope);
      }
      const deployResult = await shell.exec('vercel', deployArgs);
      if (deployResult.exit_code === 0) {
        toast('Deployed to Vercel!', 'success');
      } else {
        // Deploy failed or timed out — project is still linked
        toast('Connected to Vercel! Deploy is still running.', 'success');
      }

      await checkStatus();
    } catch (e) {
      // If link failed, show error in modal
      setShowDeployModal(true);
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
      const linkArgs = ['link', '--yes', '--project', proj.name];
      if (selectedScope) {
        linkArgs.push('--scope', selectedScope);
      }
      const result = await shell.exec('vercel', linkArgs);
      if (result.exit_code !== 0) {
        throw new Error(result.stderr || 'Failed to link project');
      }

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
      // Parse teams from `vercel team ls --no-color`
      const result = await shell.exec('vercel', ['team', 'ls', '--no-color']);
      if (result.exit_code !== 0) {
        setTeams([]);
        setSelectedScope(undefined);
        return;
      }

      const fetchedTeams: VercelTeam[] = [];
      const lines = result.stdout.split('\n');
      let headerPassed = false;

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        // Skip until we pass the separator line (dashes)
        if (trimmed.startsWith('─') || trimmed.includes('───')) {
          headerPassed = true;
          continue;
        }
        if (!headerPassed) continue;

        // Parse table row - columns separated by 2+ spaces
        const parts = trimmed.split(/\s{2,}/);
        if (parts.length < 2) continue;

        // Detect current team marker (arrow or asterisk at start)
        const isCurrent = trimmed.startsWith('>') || trimmed.startsWith('*');
        const namePart = isCurrent ? parts[0].replace(/^[>*]\s*/, '') : parts[0];
        const idPart = parts[parts.length - 1];

        if (namePart && idPart && idPart.startsWith('team_')) {
          fetchedTeams.push({
            id: idPart.trim(),
            name: namePart.trim(),
            is_current: isCurrent,
          });
        }
      }

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
