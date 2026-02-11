import { jsxs, jsx, Fragment } from "data:text/javascript,const R=window.__SHIPSTUDIO_REACT__;export const jsx=R.createElement;export const jsxs=R.createElement;export const Fragment=R.Fragment;";
import { useState, useRef, useEffect } from "data:text/javascript,export default window.__SHIPSTUDIO_REACT__;export const useState=window.__SHIPSTUDIO_REACT__.useState;export const useEffect=window.__SHIPSTUDIO_REACT__.useEffect;export const useRef=window.__SHIPSTUDIO_REACT__.useRef;export const useCallback=window.__SHIPSTUDIO_REACT__.useCallback;export const useMemo=window.__SHIPSTUDIO_REACT__.useMemo;export const createElement=window.__SHIPSTUDIO_REACT__.createElement;";
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
function getCtx() {
  const ctx = window.__SHIPSTUDIO_PLUGIN_CONTEXT__;
  if (!ctx) throw new Error("Plugin context not available");
  return ctx;
}
function VercelToolbar() {
  const ctx = getCtx();
  const project = ctx.project;
  const shell = ctx.shell;
  const toast = ctx.actions.showToast;
  const openUrl = ctx.actions.openUrl;
  const [cliStatus, setCliStatus] = useState(null);
  const [hasGitRemote, setHasGitRemote] = useState(false);
  const [projectStatus, setProjectStatus] = useState(null);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [showSiteDropdown, setShowSiteDropdown] = useState(false);
  const [deployName, setDeployName] = useState("");
  const [error, setError] = useState(null);
  const [teams, setTeams] = useState([]);
  const [selectedScope, setSelectedScope] = useState(void 0);
  const [isLoadingTeams, setIsLoadingTeams] = useState(false);
  const [linkMode, setLinkMode] = useState("new");
  const [existingProjects, setExistingProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [optimisticLinked, setOptimisticLinked] = useState(false);
  const pollRef = useRef(null);
  useEffect(() => {
    const style = document.createElement("style");
    style.setAttribute("data-vercel-plugin", "true");
    style.textContent = VERCEL_CSS;
    document.head.appendChild(style);
    return () => {
      style.remove();
    };
  }, []);
  useEffect(() => {
    void checkStatus();
    return () => {
      if (pollRef.current) clearTimeout(pollRef.current);
    };
  }, [project == null ? void 0 : project.path]);
  useEffect(() => {
    if (hasGitRemote) return;
    const interval = setInterval(async () => {
      const result = await shell.exec("git", ["remote", "-v"]).catch(() => null);
      if (result && result.exit_code === 0 && result.stdout.trim().length > 0) {
        setHasGitRemote(true);
        void checkStatus();
      }
    }, 3e3);
    return () => clearInterval(interval);
  }, [hasGitRemote]);
  const checkStatus = async () => {
    try {
      const remoteResult = await shell.exec("git", ["remote", "-v"]);
      setHasGitRemote(remoteResult.exit_code === 0 && remoteResult.stdout.trim().length > 0);
      const versionResult = await shell.exec("vercel", ["--version"]);
      const installed = versionResult.exit_code === 0;
      if (!installed) {
        setCliStatus({ installed: false, authenticated: false });
        return;
      }
      const whoamiResult = await shell.exec("vercel", ["whoami"]);
      const authenticated = whoamiResult.exit_code === 0;
      setCliStatus({ installed: true, authenticated });
      if (authenticated && (project == null ? void 0 : project.path)) {
        const catResult = await shell.exec("cat", [".vercel/project.json"]);
        if (catResult.exit_code !== 0) {
          setProjectStatus({
            status: "not-linked",
            project_name: null,
            vercel_org: null,
            production_url: null,
            staging_url: null
          });
          return;
        }
        try {
          const projectJson = JSON.parse(catResult.stdout);
          const projectId = projectJson.projectId;
          const orgId = projectJson.orgId;
          if (!projectId || !orgId) {
            setProjectStatus({
              status: "not-linked",
              project_name: null,
              vercel_org: null,
              production_url: null,
              staging_url: null
            });
            return;
          }
          let projectName = projectJson.projectName || null;
          let productionUrl = null;
          let vercelOrg = null;
          const lsTextResult = await shell.exec("vercel", ["ls", "--no-color"]).catch(() => null);
          if (lsTextResult && lsTextResult.exit_code === 0) {
            const lines = lsTextResult.stdout.split("\n");
            for (const line of lines) {
              const scopeMatch = line.match(/under\s+(\S+)/);
              if (scopeMatch) {
                vercelOrg = scopeMatch[1];
              }
              const projMatch = line.match(/Deployments?\s+for\s+(\S+)/);
              if (projMatch && !projectName) {
                projectName = projMatch[1];
              }
            }
          }
          const lsJsonResult = await shell.exec("vercel", ["ls", "--json"]).catch(() => null);
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
                if (!vercelOrg && dep.inspectorUrl) {
                  const match = String(dep.inspectorUrl).match(/vercel\.com\/([^/]+)\//);
                  if (match) vercelOrg = match[1];
                }
              }
            } catch {
            }
          }
          setProjectStatus({
            status: "connected",
            project_name: projectName,
            vercel_org: vercelOrg,
            production_url: productionUrl,
            staging_url: null
          });
        } catch {
          setProjectStatus({
            status: "not-linked",
            project_name: null,
            vercel_org: null,
            production_url: null,
            staging_url: null
          });
        }
      }
    } catch {
      setCliStatus({ installed: false, authenticated: false });
    }
  };
  if (!cliStatus) return null;
  if (!project) return null;
  if (!hasGitRemote && (projectStatus == null ? void 0 : projectStatus.status) !== "connected") return null;
  if (!cliStatus.installed) {
    return /* @__PURE__ */ jsxs(
      "button",
      {
        className: "vercel-button vercel-install",
        onClick: async () => {
          setIsInstalling(true);
          try {
            const brewResult = await shell.exec("brew", ["install", "vercel-cli"]);
            if (brewResult.exit_code !== 0) {
              const npmResult = await shell.exec("npm", ["install", "-g", "vercel"]);
              if (npmResult.exit_code !== 0) {
                throw new Error("Failed to install via brew and npm");
              }
            }
            toast("Vercel CLI installed!", "success");
            await checkStatus();
          } catch {
            toast("Failed to install Vercel CLI", "error");
          } finally {
            setIsInstalling(false);
          }
        },
        disabled: isInstalling,
        title: "Install Vercel CLI via npm",
        children: [
          /* @__PURE__ */ jsx(VercelIcon, {}),
          isInstalling ? "Installing..." : "Install Vercel"
        ]
      }
    );
  }
  if (!cliStatus.authenticated) {
    return /* @__PURE__ */ jsxs(
      "button",
      {
        className: "vercel-button vercel-connect",
        title: "Connect your Vercel account",
        onClick: () => toast('Run "vercel login" in the terminal to connect', "success"),
        children: [
          /* @__PURE__ */ jsx(VercelIcon, {}),
          "Connect Vercel"
        ]
      }
    );
  }
  if (isDeploying) {
    return /* @__PURE__ */ jsxs("button", { className: "vercel-button vercel-deploying", disabled: true, title: "Deploying to Vercel...", children: [
      /* @__PURE__ */ jsx(VercelIcon, {}),
      /* @__PURE__ */ jsx("span", { className: "deploying-text", children: "Deploying..." })
    ] });
  }
  if ((projectStatus == null ? void 0 : projectStatus.status) === "connected") {
    const dashboardUrl = projectStatus.vercel_org && projectStatus.project_name ? `https://vercel.com/${projectStatus.vercel_org}/${projectStatus.project_name}` : "https://vercel.com/dashboard";
    const productionUrl = projectStatus.production_url;
    const branch = project.currentBranch || "main";
    const isMainBranch = branch === "main" || branch === "master";
    const previewUrl = !isMainBranch && projectStatus.project_name ? `${projectStatus.project_name}-git-${branch.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}.vercel.app` : null;
    const hasUrls = productionUrl || previewUrl;
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: "vercel-button-container",
        onMouseEnter: () => hasUrls && setShowSiteDropdown(true),
        onMouseLeave: () => setShowSiteDropdown(false),
        children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "vercel-button vercel-linked",
              onClick: () => openUrl(dashboardUrl),
              title: "Open Vercel dashboard",
              children: /* @__PURE__ */ jsx(VercelIcon, {})
            }
          ),
          showSiteDropdown && hasUrls && /* @__PURE__ */ jsx("div", { className: "vercel-site-dropdown", children: /* @__PURE__ */ jsxs("div", { className: "vercel-site-dropdown-inner", children: [
            productionUrl && /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  openUrl(`https://${productionUrl}`);
                },
                children: [
                  /* @__PURE__ */ jsx("span", { className: "vercel-site-badge vercel-site-badge-prod", children: "Prod" }),
                  /* @__PURE__ */ jsx("span", { className: "vercel-site-url", children: productionUrl }),
                  /* @__PURE__ */ jsx(ExternalLinkIcon, {})
                ]
              }
            ),
            previewUrl && /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  openUrl(`https://${previewUrl}`);
                },
                children: [
                  /* @__PURE__ */ jsx("span", { className: "vercel-site-badge vercel-site-badge-preview", children: "Preview" }),
                  /* @__PURE__ */ jsx("span", { className: "vercel-site-url", children: previewUrl }),
                  /* @__PURE__ */ jsx(ExternalLinkIcon, {})
                ]
              }
            )
          ] }) })
        ]
      }
    );
  }
  if (projectStatus === null) {
    return /* @__PURE__ */ jsxs("button", { className: "vercel-button vercel-checking", disabled: true, title: "Checking Vercel status...", children: [
      /* @__PURE__ */ jsx(VercelIcon, {}),
      /* @__PURE__ */ jsx("span", { className: "checking-text", children: "Connecting..." })
    ] });
  }
  if (optimisticLinked) {
    return /* @__PURE__ */ jsx("button", { className: "vercel-button vercel-linked", disabled: true, title: "Connected to Vercel", children: /* @__PURE__ */ jsx(VercelIcon, {}) });
  }
  const loadExistingProjects = async (scope) => {
    var _a;
    setIsLoadingProjects(true);
    setSelectedProjectId("");
    try {
      const args = ["project", "ls", "--no-color"];
      if (scope) {
        args.push("--scope", scope);
      }
      const result = await shell.exec("vercel", args);
      if (result.exit_code !== 0) {
        setExistingProjects([]);
        return;
      }
      const orgId = scope || "personal";
      const projects = [];
      const clean = result.stdout.replace(/\x1b\[[0-9;]*m/g, "");
      const lines = clean.split("\n");
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        if (trimmed.startsWith(">")) continue;
        if (trimmed.includes("───")) continue;
        const firstCol = (_a = trimmed.split(/\s{2,}/)[0]) == null ? void 0 : _a.trim();
        if (!firstCol) continue;
        if (/^[a-z0-9][a-z0-9_.-]*$/.test(firstCol)) {
          projects.push({ id: firstCol, name: firstCol, orgId });
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
      const linkArgs = ["link", "--yes", "--project", deployName.trim()];
      if (selectedScope) {
        linkArgs.push("--scope", selectedScope);
      }
      const linkResult = await shell.exec("vercel", linkArgs);
      if (linkResult.exit_code !== 0) {
        throw new Error(linkResult.stderr || "Failed to link project");
      }
      const deployArgs = ["--prod", "--yes"];
      if (selectedScope) {
        deployArgs.push("--scope", selectedScope);
      }
      const deployResult = await shell.exec("vercel", deployArgs);
      if (deployResult.exit_code === 0) {
        toast("Deployed to Vercel!", "success");
      } else {
        toast("Connected to Vercel! Deploy is still running.", "success");
      }
      await checkStatus();
    } catch (e) {
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
      const linkArgs = ["link", "--yes", "--project", proj.name];
      if (selectedScope) {
        linkArgs.push("--scope", selectedScope);
      }
      const result = await shell.exec("vercel", linkArgs);
      if (result.exit_code !== 0) {
        throw new Error(result.stderr || "Failed to link project");
      }
      setShowDeployModal(false);
      setOptimisticLinked(true);
      toast("Linked to Vercel project!", "success");
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
    setLinkMode("new");
    setExistingProjects([]);
    setSelectedProjectId("");
    setIsLoadingTeams(true);
    try {
      const result = await shell.exec("vercel", ["team", "ls", "--no-color"]);
      if (result.exit_code !== 0) {
        setTeams([]);
        setSelectedScope(void 0);
        return;
      }
      const fetchedTeams = [];
      const lines = result.stdout.split("\n");
      let headerPassed = false;
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        if (trimmed.startsWith("─") || trimmed.includes("───")) {
          headerPassed = true;
          continue;
        }
        if (!headerPassed) continue;
        const parts = trimmed.split(/\s{2,}/);
        if (parts.length < 2) continue;
        const isCurrent = trimmed.startsWith(">") || trimmed.startsWith("*");
        const namePart = isCurrent ? parts[0].replace(/^[>*]\s*/, "") : parts[0];
        const idPart = parts[parts.length - 1];
        if (namePart && idPart && idPart.startsWith("team_")) {
          fetchedTeams.push({
            id: idPart.trim(),
            name: namePart.trim(),
            is_current: isCurrent
          });
        }
      }
      setTeams(fetchedTeams);
      const currentTeam = fetchedTeams.find((t) => t.is_current);
      setSelectedScope(currentTeam ? currentTeam.id : void 0);
    } catch {
      setTeams([]);
      setSelectedScope(void 0);
    } finally {
      setIsLoadingTeams(false);
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        className: "vercel-button vercel-setup",
        onClick: () => void handleOpenDeployModal(),
        title: "Connect to Vercel for auto-deployments",
        children: [
          /* @__PURE__ */ jsx(VercelIcon, {}),
          "Connect Vercel"
        ]
      }
    ),
    showDeployModal && /* @__PURE__ */ jsx(
      "div",
      {
        className: "modal-overlay",
        onClick: () => {
          if (!isDeploying) setShowDeployModal(false);
        },
        children: /* @__PURE__ */ jsxs("div", { className: "modal vercel-modal", onClick: (e) => e.stopPropagation(), children: [
          /* @__PURE__ */ jsx("h3", { children: "Connect to Vercel" }),
          /* @__PURE__ */ jsx("p", { children: "Link this project to Vercel for automatic deployments when you publish." }),
          /* @__PURE__ */ jsxs("div", { className: "vercel-link-mode-toggle", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                className: linkMode === "new" ? "active" : "",
                onClick: () => setLinkMode("new"),
                children: "Create new project"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: linkMode === "existing" ? "active" : "",
                onClick: () => {
                  setLinkMode("existing");
                  if (existingProjects.length === 0) {
                    void loadExistingProjects(selectedScope);
                  }
                },
                children: "Link existing project"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "vercel-form", children: [
            isLoadingTeams ? /* @__PURE__ */ jsxs("div", { className: "vercel-form-loading", children: [
              /* @__PURE__ */ jsx("div", { className: "vercel-form-spinner" }),
              /* @__PURE__ */ jsx("span", { children: "Loading teams..." })
            ] }) : teams.length > 0 && /* @__PURE__ */ jsxs("label", { children: [
              "Team",
              /* @__PURE__ */ jsxs(
                "select",
                {
                  className: "owner-select",
                  value: selectedScope || "",
                  onChange: (e) => {
                    const newScope = e.target.value || void 0;
                    setSelectedScope(newScope);
                    if (linkMode === "existing") {
                      void loadExistingProjects(newScope);
                    }
                  },
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "Personal Account" }),
                    teams.map((team) => /* @__PURE__ */ jsx("option", { value: team.id, children: team.name }, team.id))
                  ]
                }
              )
            ] }),
            linkMode === "new" ? /* @__PURE__ */ jsxs("label", { children: [
              "Vercel project name",
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: deployName,
                  onChange: (e) => setDeployName(e.target.value.replace(/[^a-zA-Z0-9-_]/g, "-").toLowerCase()),
                  placeholder: "my-project",
                  autoFocus: true,
                  autoComplete: "off",
                  autoCorrect: "off",
                  autoCapitalize: "off",
                  spellCheck: false
                }
              )
            ] }) : /* @__PURE__ */ jsx(Fragment, { children: isLoadingProjects ? /* @__PURE__ */ jsxs("div", { className: "vercel-form-loading", children: [
              /* @__PURE__ */ jsx("div", { className: "vercel-form-spinner" }),
              /* @__PURE__ */ jsx("span", { children: "Loading projects..." })
            ] }) : existingProjects.length === 0 ? /* @__PURE__ */ jsx("div", { className: "vercel-form-empty", children: "No projects found for this scope" }) : /* @__PURE__ */ jsxs("label", { children: [
              "Select project",
              /* @__PURE__ */ jsxs(
                "select",
                {
                  className: "owner-select",
                  value: selectedProjectId,
                  onChange: (e) => setSelectedProjectId(e.target.value),
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "Choose a project..." }),
                    existingProjects.map((p) => /* @__PURE__ */ jsx("option", { value: p.id, children: p.name }, p.id))
                  ]
                }
              )
            ] }) }),
            error && /* @__PURE__ */ jsx("p", { className: "vercel-error", children: error })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "modal-actions", children: [
            /* @__PURE__ */ jsx("button", { onClick: () => setShowDeployModal(false), disabled: isDeploying || isLinking, children: "Cancel" }),
            linkMode === "new" ? /* @__PURE__ */ jsx(
              "button",
              {
                className: "btn-primary",
                onClick: () => void handleDeploy(),
                disabled: isDeploying || !deployName.trim(),
                children: isDeploying ? "Connecting..." : "Connect & Deploy"
              }
            ) : /* @__PURE__ */ jsx(
              "button",
              {
                className: "btn-primary",
                onClick: () => void handleLinkExisting(),
                disabled: isLinking || !selectedProjectId,
                children: isLinking ? "Linking..." : "Link Project"
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
function VercelIcon() {
  return /* @__PURE__ */ jsx("svg", { width: "14", height: "14", viewBox: "0 0 116 100", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { d: "M57.5 0L115 100H0L57.5 0Z" }) });
}
function ExternalLinkIcon() {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      width: "12",
      height: "12",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      children: [
        /* @__PURE__ */ jsx("path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" }),
        /* @__PURE__ */ jsx("polyline", { points: "15 3 21 3 21 9" }),
        /* @__PURE__ */ jsx("line", { x1: "10", y1: "14", x2: "21", y2: "3" })
      ]
    }
  );
}
const name = "Vercel";
const slots = {
  toolbar: VercelToolbar
};
export {
  name,
  slots
};
