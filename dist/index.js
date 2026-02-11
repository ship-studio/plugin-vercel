import { jsxs, jsx, Fragment } from "data:text/javascript,const R=window.__SHIPSTUDIO_REACT__;export const jsx=R.createElement;export const jsxs=R.createElement;export const Fragment=R.Fragment;";
import { useState, useRef, useEffect } from "data:text/javascript,export default window.__SHIPSTUDIO_REACT__;export const useState=window.__SHIPSTUDIO_REACT__.useState;export const useEffect=window.__SHIPSTUDIO_REACT__.useEffect;export const useRef=window.__SHIPSTUDIO_REACT__.useRef;export const useCallback=window.__SHIPSTUDIO_REACT__.useCallback;export const useMemo=window.__SHIPSTUDIO_REACT__.useMemo;export const createElement=window.__SHIPSTUDIO_REACT__.createElement;";
function getCtx() {
  const ctx = window.__SHIPSTUDIO_PLUGIN_CONTEXT__;
  if (!ctx) throw new Error("Plugin context not available");
  return ctx;
}
function VercelToolbar() {
  const ctx = getCtx();
  const project = ctx.project;
  const invoke = ctx.invoke;
  const toast = ctx.actions.showToast;
  const openUrl = ctx.actions.openUrl;
  const [cliStatus, setCliStatus] = useState(null);
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
    void checkStatus();
    return () => {
      if (pollRef.current) clearTimeout(pollRef.current);
    };
  }, [project == null ? void 0 : project.path]);
  const checkStatus = async () => {
    try {
      const status = await invoke.call("check_vercel_cli_status");
      setCliStatus(status);
      if (status.authenticated && (project == null ? void 0 : project.path)) {
        const vs = await invoke.call("get_project_vercel_status", {
          projectPath: project.path
        }).catch(
          () => ({
            status: "not-linked",
            project_name: null,
            vercel_org: null,
            production_url: null,
            staging_url: null
          })
        );
        setProjectStatus(vs);
      }
    } catch {
      setCliStatus({ installed: false, authenticated: false });
    }
  };
  if (!cliStatus) return null;
  if (!project) return null;
  if (!cliStatus.installed) {
    return /* @__PURE__ */ jsxs(
      "button",
      {
        className: "vercel-button vercel-install",
        onClick: async () => {
          setIsInstalling(true);
          try {
            await invoke.call("install_vercel_cli");
            toast("Vercel CLI installed!", "success");
            await checkStatus();
          } catch (e) {
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
    setIsLoadingProjects(true);
    setSelectedProjectId("");
    try {
      const projects = await invoke.call("list_vercel_projects", {
        scope: scope || ""
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
      await invoke.call("deploy_to_vercel", {
        options: {
          projectPath: project.path,
          projectName: deployName,
          scope: selectedScope
        }
      });
      setShowDeployModal(false);
      toast("Connected to Vercel!", "success");
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
      await invoke.call("write_vercel_project_json", {
        projectPath: project.path,
        projectId: proj.id,
        orgId: proj.orgId,
        projectName: proj.name
      });
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
      const fetchedTeams = await invoke.call("get_vercel_teams");
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
