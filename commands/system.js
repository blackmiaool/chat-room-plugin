import api from '../';

const $ = api.$;

const name = 'system';
const showBase = false;
const render = function (content) {
    const $dom = $('<p></p>');
    const $wrapper = $('<div></div>');

    $wrapper.append($dom);
    $dom.text(`系统消息:${content}`);

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
api.registerMessage({ name, showBase, render });
