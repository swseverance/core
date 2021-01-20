/* eslint-disable no-undef */
const APP_NAME = 'Control Application';

const platformConfig = {
  applications: {
    local: [
      {
        name: "appA",
        type: "window",
        details: {
          url: "/app-a/index.html"
        }
      },
      {
        name: "appB",
        type: "window",
        details: {
          url: "/app-b/index.html"
        }
      }
    ]
  },
  layouts: {
    mode: "session",
    local: [
      {
        name: "Workspace-Layout-One",
        type: "Workspace",
        metadata: {},
        components: [
          {
            type: "Workspace",
            state: {
              children: [
                {
                  type: "column",
                  children: [
                    {
                      type: "row",
                      children: [
                        {
                          type: "group",
                          children: [
                            {
                              type: "window",
                              config: {
                                appName: "appA",
                                title: "App A"
                              }
                            }
                          ],
                          config: {}
                        },
                        {
                          type: "group",
                          children: [
                            {
                              type: "window",
                              config: {
                                appName: "appB",
                                title: "App B"
                              }
                            }
                          ],
                          config: {}
                        }
                      ],
                      config: {}
                    }
                  ],
                  config: {}
                }
              ],
              config: {
                name: "Workspace-Layout-One",
                title: "Workspace-Layout-One"
              },
              context: {}
            }
          }
        ]
      },
      {
        name: "Workspace-Layout-Two",
        type: "Workspace",
        metadata: {},
        components: [
          {
            type: "Workspace",
            state: {
              children: [
                {
                  type: "column",
                  children: [
                    {
                      type: "row",
                      children: [
                        {
                          type: "group",
                          children: [
                            {
                              type: "window",
                              config: {
                                appName: "appA",
                                title: "App A"
                              }
                            }
                          ],
                          config: {}
                        },
                        {
                          type: "group",
                          children: [
                            {
                              type: "window",
                              config: {
                                appName: "appB",
                                title: "App B"
                              }
                            }
                          ],
                          config: {}
                        }
                      ],
                      config: {}
                    },
                    {
                      type: "group",
                      children: [
                        {
                          type: "window",
                          config: {
                            appName: "appB",
                            title: "App B"
                          }
                        }
                      ],
                      config: {}
                    }
                  ],
                  config: {}
                }
              ],
              config: {
                name: "Workspace-Layout-Two",
                title: "Workspace-Layout-Two"
              },
              context: {}
            }
          }
        ]
      }
    ]
  },
  workspaces: {
    src: "/workspaces/"
  },
  glue: {
    libraries: [window.GlueWorkspaces],
  }
};

const onWorkspaceClose = async (workspaceId) => {
  const workspace = await glue.workspaces.getWorkspace((wsp) => wsp.id === workspaceId);

  if (!workspace) {
    logger.error({ message: "This workspace was already closed" });
  } else {
    await workspace.close();
  }

  clearWorkspace(workspaceId);

};

const onWorkspaceStart = async (workspaceName) => {
  const contextValue = document.getElementById(workspaceName).value;
  const context = contextValue.length ? { data: contextValue } : null;
  const workspace = await glue.workspaces.restoreWorkspace(workspaceName, { context });
  renderWorkspaceInstance(workspace.id, onWorkspaceClose);
};

// Entry point. Initializes Glue42 Web. А Glue42 Web instance will be attached to the global window.
window.startApp({ appName: APP_NAME, platformConfig })
  .then(() => {
    return glue.workspaces.layouts.getSummaries();
  })
  .then((layoutsSummaries) => {
    const workspacesName = layoutsSummaries.map((summary) => summary.name);
    return renderWorkspacesLayoutsNames(workspacesName, onWorkspaceStart)
  })
  .catch(console.error);
