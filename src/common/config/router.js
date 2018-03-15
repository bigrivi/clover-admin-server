module.exports = [
    [/\/uploader\/attachment\/preview/, '/uploader/attachment/preview', 'get'],
    [/\/(\w+)\/(\w+)\/export(?:\/(\w+))?/, '', 'get'],
     [/\/(\w+)\/(\w+)(?:\/(\w+))?/, ':1/:2?id=:3', 'rest']

];