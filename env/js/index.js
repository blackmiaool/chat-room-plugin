const plugin = require("./package/index.js")
const $ = require('jquery');
setTimeout(function () {

    $("#message-list").scrollTop(100000);

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
                    const $message = $(`<div data-flex="dir:right" class="message-list-item">
                <div data-flex="dir:right" data-flex-box="0" class="message-container">
                    <div data-flex-box="0" data-flex="main:top cross:top" class="avatar-container">
                        <div>
                            <div class="avatar" style="width: 39px; height: 39px; background-image: url(&quot;./res/5812bad543f61.jpg&quot;);"></div>
                        </div>
                    </div>
                    <div style="padding: 0px 10px; width: 100%; text-align: right;"><span class="nickname">blackmiaool 18:31:51</span>
                        <div class="message">
                            <div class="triangle-right-outer"></div>
                            <div class="triangle-right-inner"></div>
                        </div>
                    </div>
                </div>
            </div>`);
                    $message.find(".message").empty().append(plugin.getMessage(pluginInfo.name, pluginInfo.content, true));
                    $("#message-list").append($message);
                    $("#message-list").scrollTop(100000);
                });
            }

        }
    }
    $("#message-input").val("boom(MD)");
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
    if($item){
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