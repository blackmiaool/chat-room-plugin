const exports = {
    init
};

const messageList = {};

function extend(to, from) {
    for (const i in from) {
        to[i] = from[i];
    }
}

function init(api) {
    const jQuery=require('jquery');
    
    extend(exports, api);        
    exports.$=jQuery;
    window.jQuery=jQuery;
    require('jquery.easing');
    require("jquery-image-explode");    
    require("./commands/boom.js");
    require("./commands/system.js");
    require("./commands/shit.js");
}




function getMessage(name, content, isNew) {
    if (!content.get&&typeof content==="object") {
        content.get = function (key) {
            return this[key];
        }
    }
    return messageList[name].render(content, isNew);
}

function registerMessage({
    name,
    showBase,
    process,
    render,
}) {
    messageList[name] = {
        name,
        showBase,
        process,
        render,
        
    };
}
extend(exports, {
    getMessage,
    registerMessage,
    messageList,
});
export default exports;