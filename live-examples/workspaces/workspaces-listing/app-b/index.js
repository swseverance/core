/* eslint-disable no-undef */
const APP_NAME = 'Application B';

// Entry point. Initializes Glue42 Web. А Glue42 Web instance will be attached to the global window.
const init = async () => {
  await startApp({ appName: APP_NAME, application: "appB" });

  const windowId = glue.windows.my().id;
  document.getElementById('windowIdText').textContent = windowId;

  const appName = glue.appManager.myInstance.application ? glue.appManager.myInstance.application.name : "name not found";
  document.getElementById('windowNameText').textContent = appName;

  const url = await glue.windows.my().getURL();
  document.getElementById('urlText').textContent = url;

  const myWsp = await glue.workspaces.getMyWorkspace();
  const ctx = await myWsp.getContext();
  document.getElementById('contextText').textContent = ctx.data;
};

init().catch(console.error);