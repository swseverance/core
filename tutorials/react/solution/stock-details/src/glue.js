import {
    SET_PRICES_STREAM,
    SHARED_CONTEXT_NAME
} from "./constants";

export const getMyWindowContext = (setWindowContext) => async (glue) => {
    const myWindow = glue.windows.my();
    const context = await myWindow.getContext();
    
    setWindowContext({ symbol: context.symbol });

    myWindow.onContextUpdated((context) => {
        if (context) {
            setWindowContext({ symbol: context.symbol });
        };
    });
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

export const subscribeForSharedContext = (handler) => (glue) => {
    // Subscribing for the shared context by 
    // providing a context name and a handler for context updates.
    glue.contexts.subscribe(SHARED_CONTEXT_NAME, handler);
};