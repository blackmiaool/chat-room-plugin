import api from '../';

const $ = api.$;

const name = 'system';
const showBase = false;
const render = function (content, isNew) {
    const $dom = $('<p style="position:relative;height:32px;"></p>');
    const $wrapper = $('<div></div>');
    const info = api.getPluginMessageInfo({
        content,
        from: ""
    });
    if (info) {
        //        console.log(info) 
        console.log(info, isNew)
        $dom.append(`<span style="display: inline-block;vertical-align: top;">系统消息:</span>`)
        const $sub = api.getMessage(info.name, info.content, isNew);
        if (info.name === "boom") {
            $sub.css({
                'margin-top': '-13px'
            });
        }else if(info.name === "shit") {
            $sub.css({
                'margin-top': '-14px'
            });
        }
        $dom.append($sub)
    } else {
        $dom.text(`系统消息:${content}`);
    }
    $wrapper.append($dom);


    $wrapper.css({
        margin: '10px 0',
        textAlign: 'center',


    });
    $dom.css({
        display: 'inline-block',
        color: 'white',
        backgroundColor: '#999',
        borderRadius: '50px',
        padding: '5px 20px 6px',
    });

    return $wrapper;
};
api.registerMessage({
    name,
    showBase,
    render
});