export const setClientFromWorkspace = (setClient) => async (glue) => {
    const myWorkspace = await glue.workspaces.getMyWorkspace();
    myWorkspace.onContextUpdated((context) => {
        if (context) {
            setClient(context);
            myWorkspace.setTitle(context.clientName);
        };
    });
};