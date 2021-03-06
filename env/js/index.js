const plugin = require("./package/index.js")
const $ = require('jquery');

function sendMessage(direction, pluginInfo, username) {
    const $message = $(`<div data-flex="dir:${direction}" class="message-list-item">
                <div data-flex="dir:${direction}" data-flex-box="0" class="message-container">
                    <div data-flex-box="0" data-flex="main:top cross:top" class="avatar-container">
                        <div>
                            <div class="avatar" style=" background-image: url(&quot;./res/5812bad543f61.jpg&quot;);"></div>
                        </div>
                    </div>
                    <div style="padding: 0px 10px; width: 100%; text-align: ${direction};"><span class="nickname">${username} 18:31:51</span>
                        <div class="message">
                            <div class="triangle-${direction}-outer"></div>
                            <div class="triangle-${direction}-inner"></div>
                        </div>
                    </div>
                </div>
            </div>`);
    $message.find(".message").empty().append(plugin.getMessage(pluginInfo.name, pluginInfo.content, true));
    $("#message-list").append($message);
    $("#message-list").scrollTop(100000);
}
setTimeout(function () {
    const content = $("#message-input").val();
    console.log(content)
    const pluginInfo = getPluginMessageInfo({
        content,
        from: {
            username: "MD纸一张"
        }
    });
    console.log(pluginInfo)
    sendMessage('right', pluginInfo, "blackmiaool");
}, 500);
setTimeout(function () {

    $("#message-list").scrollTop(100000);
    $("#send-btn").on("click", function () {
        const content = $("#message-input").val();
        const pluginInfo = getPluginMessageInfo({
            content,
            from: {
                username: "MD纸一张"
            }
        });
        sendMessage('left', pluginInfo, "MD纸一张");
    });

    function onKeyUp(e) {
        if (e.originalEvent.code === "Enter") {
            const content = $(this).val();
            const pluginInfo = getPluginMessageInfo({
                content,
                from: {
                    username: "blackmiaool"
                }
            });
            console.log(pluginInfo);
            if (pluginInfo) {
                setTimeout(function () {
                    sendMessage('right', pluginInfo, 'blackmiaool');
                });
            }

        }
    }
    $("#message-input").val("capture(york)");
    $("#message-input").on("keyup", onKeyUp);
});



function getPluginMessageInfo(message) {
    let {
        content,
    } = message;

    const match = content.trim().match(/^([a-zA-Z0-9_-]+)\s*\(([\s\S]*)\)\s*;?\s*$/);

    const name = match && match[1];
    if (!name) {
        return;
    }

    const typeInfo = plugin.messageList[name];
    if (!typeInfo) {
        return;
    }
    const {
        showBase,
        process,
    } = typeInfo;

    if (process) {
        content = process(message);
    } else {
        content = match[2];
    }
    const ret = {
        name,
        content,
        showBase,
    };
    return ret;
}

function findUserMessage(userName) {
    let fullMatch = false;
    const match = userName.match(/^"([\s\S]*)"$/);
    if (match) {
        userName = match[1];
        fullMatch = true;
    }
    const $names = $('.message-list-item').find('.nickname');
    let $item;
    for (let i = $names.length - 1; i >= 0; i--) {
        const thisName = $names.eq(i).text();
        if (fullMatch) {
            if (thisName === userName) {
                $item = $names.eq(i).parents('.message-list-item');
                break;
            }
        } else {
            if (thisName.indexOf(userName) !== -1) {
                $item = $names.eq(i).parents('.message-list-item');
                break;
            }
        }
    }
    if ($item) {
        $item.avatar = $item.find(".avatar");
    }

    return $item;
}




//class PluginMessage extends React.Component {
//    componentDidMount() {
//        this.renderMessage();
//    }
//    shouldComponentUpdate(nextProps) {
//        const currentProps = this.props;
//        return !(
//            currentProps.content === nextProps.content &&
//            currentProps.name === nextProps.name
//        );
//    }
//
//    componentDidUpdate() {
//        this.renderMessage();
//    }
//
//    renderMessage() {
//        $(this.dom).empty()
//            .append(plugin.getMessage(this.props.name, this.props.content, this.props.isNew));
//    }
//    render() {
//        return (<div
//            className="plugin-dom-container"
//            ref={dom => this.dom = dom}
//        />);
//    }
//}
//
//PluginMessage.propTypes = {
//    name: PropTypes.string.isRequired,
//    content: PropTypes.any,
//    isNew: PropTypes.bool.isRequired,
//};


plugin.init({
    findUserMessage,
})

export default {
    registerMessage: plugin.registerMessage,
    getPluginMessageInfo,
    getMessage: plugin.getMessage,
    findUserMessage,
    timestamp: 0,
    //    PluginMessage
};