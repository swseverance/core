import {
    SET_CLIENT_METHOD,
    SHARED_CONTEXT_NAME,
    NO_CHANNEL_VALUE
} from "./constants";

let windowID = 0;

export const openStocks = (glue) => () => {
    // The `name` and `url` parameters are required. The window name must be unique.
    const name = `Stocks-${++windowID}`;
    const URL = "http://localhost:3001/";

    glue.windows.open(name, URL).catch(console.error);
};

export const setClientPortfolioInterop = (glue) => ({ clientId, clientName }) => {
    // Check whether the method exists.
    const isMethodRegistered = glue.interop
        .methods()
        .some(({ name }) => name === SET_CLIENT_METHOD.name);
    if (isMethodRegistered) {
        // Invoke an Interop method by name and provide arguments for the invocation.
        glue.interop.invoke(SET_CLIENT_METHOD.name, { clientId, clientName });
    };
};

export const setClientPortfolioSharedContext = (glue) => (
    {
        clientId = "",
        clientName = "",
        portfolio = ""
    }
) => {
    glue.contexts.update(SHARED_CONTEXT_NAME, {
        clientId,
        clientName,
        portfolio
    });
};

// Returns all names and color codes of the avaialbale Channels.
export const getChannelNamesAndColors = async (glue) => {
    // Getting a list of all Channel contexts.
    const channelContexts = await glue.channels.list();

    // Extracting only the names and colors of the Channels.
    const channelNamesAndColors = channelContexts.map((channelContext) => {
        const channelInfo = {
            name: channelContext.name,
            color: channelContext.meta.color
        };

        return channelInfo;
    });

    return channelNamesAndColors;
};

// This function will join a given Channel.
export const joinChannel = (glue) => ({ value: channelName }) => {
    if (channelName === NO_CHANNEL_VALUE) {
        // Checking for the current Channel.
        if (glue.channels.my()) {
            // Leaving a Channel.
            glue.channels.leave();
        }
    } else {
        // Joining a Channel.
        glue.channels.join(channelName);
    };
};

export const setClientPortfolioChannels = (glue) => (
    {
        clientId = "",
        clientName = ""
    }
) => {
    // Checking for the current Channel.
    if (glue.channels.my()) {
        // Publishing data to the Channel.
        glue.channels.publish({ clientId, clientName });
    };
};

export const startApp = glue => async () => {
    const channels = await glue.channels.list();
    let channel = {};
    if (glue.channels.my()) {
        const channelDefinition = channels.find(channel => channel.name === glue.channels.my());
        channel = {
            name: channelDefinition.name,
            label: channelDefinition.name,
            color: channelDefinition.meta.color
        };
    } else {
        channel = {
            name: NO_CHANNEL_VALUE,
            label: NO_CHANNEL_VALUE
        }
    };
    glue.appManager.application("Stocks").start({ channel });
};

export const startAppWithWorkspace = (glue) => (client) => {
    glue.workspaces.restoreWorkspace("Client Space", { context: client });
};