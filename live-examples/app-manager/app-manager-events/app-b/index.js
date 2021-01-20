/* eslint-disable no-undef */
const APP_NAME = "Application B";

// Entry point. Initializes Glue42 Web. A Glue42 Web instance will be attached to the global window.
window
  .startApp({ appName: APP_NAME })
  .then(subscribeToAppManagerEvents)

  .then(clearLogsHandler)
  .catch(console.error);

function subscribeToAppManagerEvents() {

  glue.appManager.onInstanceStarted(instance => {
    const instanceId = instance.id;
    const appName = instance.application.name;

    // Application B is not started as an application, so it will not be listed.
    logger.info(`Instance of app ${appName} with id "${instanceId}" started.`);
  });

  glue.appManager.onInstanceStopped(instance => {
    const appName = instance.application.name;
    logger.info(`Instance of app ${appName} with id "${instance.id}" stopped.`);
  });
}
