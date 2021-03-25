import {
    SET_CLIENT_METHOD,
    SET_PRICES_STREAM,
    SHARED_CONTEXT_NAME,
    NO_CHANNEL_VALUE
} from "./constants";

export const publishInstrumentPrice = (stream) => {
    setInterval(() => {
        const stocks = {
            "VOD.L": {
                Bid: Number(70 - Math.random() * 10).toFixed(2),
                Ask: Number(70 + Math.random() * 10).toFixed(2)
            },
            "TSCO.L": {
                Bid: Number(90 - Math.random() * 10).toFixed(2),
                Ask: Number(90 + Math.random() * 10).toFixed(2)
            },
            "BARC.L": {
                Bid: Number(105 - Math.random() * 10).toFixed(2),
                Ask: Number(105 + Math.random() * 10).toFixed(2)
            },
            "BMWG.DE": {
                Bid: Number(29 - Math.random() * 10).toFixed(2),
                Ask: Number(29 + Math.random() * 10).toFixed(2)
            },
            "AAL.L": {
                Bid: Number(46 - Math.random() * 10).toFixed(2),
                Ask: Number(46 + Math.random() * 10).toFixed(2)
            },
            "IBM.N": {
                Bid: Number(70 - Math.random() * 10).toFixed(2),
                Ask: Number(70 + Math.random() * 10).toFixed(2)
            },
            "AAPL.OQ": {
                Bid: Number(90 - Math.random() * 10).toFixed(2),
                Ask: Number(90 + Math.random() * 10).toFixed(2)
            },
            "BA.N": {
                Bid: Number(105 - Math.random() * 10).toFixed(2),
                Ask: Number(105 + Math.random() * 10).toFixed(2)
            },
            "TSLA:OQ": {
                Bid: Number(29 - Math.random() * 10).toFixed(2),
                Ask: Number(29 + Math.random() * 10).toFixed(2)
            },
            "ENBD.DU": {
                Bid: Number(46 - Math.random() * 10).toFixed(2),
                Ask: Number(46 + Math.random() * 10).toFixed(2)
            },
            "AMZN.OQ": {
                Bid: Number(29 - Math.random() * 10).toFixed(2),
                Ask: Number(29 + Math.random() * 10).toFixed(2)
            },
            "MSFT:OQ": {
                Bid: Number(46 - Math.random() * 10).toFixed(2),
                Ask: Number(46 + Math.random() * 10).toFixed(2)
            }
        };
        // Push the new stock prices to the stream using the `stream.push()` method.
        stream.push(stocks);
    }, 1500);
};

export const openStockDetails = (glue) => async (symbol) => {
    const detailsApplication = glue.appManager.application("Stock Details");

    // Check whether an instance with the selected stock is already running.
    const contexts = await Promise.all(
        // Use the `instances` property to get all running application instances.
        detailsApplication.instances.map(instance => instance.getContext())
    );
    const isRunning = contexts.find(context => context.symbol.RIC === symbol.RIC);
    
    if (!isRunning) {
        detailsApplication.start({ symbol }).catch(console.error);
    };
};

export const registerSetClientMethod = (setClient) => (glue) => {
    // Register an Interop method by providing a name and a handler.
    glue.interop.register(SET_CLIENT_METHOD, setClient);
};

export const createInstrumentStream = async (glue) => {
    const stream = await glue.interop.createStream(SET_PRICES_STREAM);
    publishInstrumentPrice(stream);
};

export const subscribeForInstrumentStream = (handler) => async (glue, symbol) => {
    if (symbol) {
        // Create a stream subscription.
        const subscription = await glue.interop.subscribe(SET_PRICES_STREAM);
        const handleUpdates = ({ data: stocks }) => {
            if (stocks[symbol]) {
                handler(stocks[symbol]);
            } else if (Array.isArray(symbol)) {
                handler(stocks);
            };
        };
        // Specify a handler for new data.
        subscription.onData(handleUpdates);
        // Specify a handler if the subscription fails.
        subscription.onFailed(console.log);

        return subscription;
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

export const subscribeForSharedContext = (handler) => (glue) => {
    // Subscribing for the shared context by 
    // providing a context name and a handler for context updates.
    glue.contexts.subscribe(SHARED_CONTEXT_NAME, handler);
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

export const subscribeForChannels = (handler) => (glue) => {
    // Subscribing for updates to the current channel.
    glue.channels.subscribe(handler);
};

export const getMyWindowContext = (setWindowContext) => async (glue) => {
    const myWindow = glue.appManager.myInstance;
    const context = await myWindow.getContext();

    setWindowContext({ channel: context.channel });
};

export const setClientFromWorkspace = (setClient) => async (glue) => {
    const myWorkspace = await glue.workspaces.getMyWorkspace();
    myWorkspace.onContextUpdated((context) => {
        if (context) {
            setClient(context);
        };
    });
};

export const openStockDetailsInWorkspace = (glue) => async (symbol) => {
    // Reference to the Glue42 Window object of the Stock Details instance.
    let detailsGlue42Window;

    const myWorkspace = await glue.workspaces.getMyWorkspace();

    // Reference to the `WorkspaceWindow` object of the Stock Details instance.
    let detailsWorkspaceWindow = myWorkspace.getWindow(window => window.appName === "Stock Details");

    // Check whether the Stock Details has already been opened.
    if (detailsWorkspaceWindow) {
        detailsGlue42Window = detailsWorkspaceWindow.getGdWindow();
    } else {
        // Reference to the current window.
        const myId = glue.windows.my().id;
        // Reference to the immediate parent element of the Stocks window.
        const myImmediateParent = myWorkspace.getWindow(window => window.id === myId).parent;
        // Add a `Group` element as a sibling of the immediate parent of the Stocks window.
        const group = await myImmediateParent.parent.addGroup();

        // Open the Stock Details window in the newly created `Group` element.
        detailsWorkspaceWindow = await group.addWindow({ appName: "Stock Details" });
        await detailsWorkspaceWindow.forceLoad();
        detailsGlue42Window = detailsWorkspaceWindow.getGdWindow();
    };

    // Update the window context with the selected stock.
    detailsGlue42Window.updateContext({ symbol });
};