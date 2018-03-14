var path = require('path');
var yaml = require('js-yaml');
var fs = require("fs")

//文件夹复制
var copyForder  = function(fromPath,toPath){
    var copy1 = function( src, dst ){

    }
    var copy = function( src, dst ){
        // 读取目录中的所有文件/目录
        fs.readdir( src, function( err, paths ){
            if( err ){
                throw err;
            }

            paths.forEach(function( filepath ){
                var _src = path.join(src ,'/' + filepath),
                    _dst = path.join(dst , '/' + filepath),
                    readable, writable;
                fs.stat( _src, function( err, st ){
                    if( err ){
                        throw err;
                    }
                    // 判断是否为文件
                    if( st.isFile() ){
                        // 创建读取流
                        readable = fs.createReadStream( _src );
                        // 创建写入流
                        writable = fs.createWriteStream( _dst );
                        // 通过管道来传输流
                        readable.pipe( writable );
                    }
                    // 如果是目录则递归调用自身
                    else if( st.isDirectory() ){
                        exists( _src, _dst, copy );
                    }
                });
            });
        });
    };

    var exists = function( src, dst, callback ){
        fs.exists( dst, function( exists ){
            // 已存在
            if( exists ){
                callback( src, dst );
            }

            // 不存在
            else{
                fs.mkdir( dst, function(){
                    callback( src, dst );
                });
            }
        });
    };

    // 复制目录
    exists(fromPath,toPath,copy );
}


let modules = fs.readdirSync("src").filter(item => {
    const stat = fs.statSync(path.join("src", item));
    return stat.isDirectory();
});
console.log("===modules====")
console.log(modules)

//config.xml
modules.forEach(function(module){
    var srcCfgPath = path.join("src", module+'/config.yml');
    var targetCfgPath = path.join("app", module+'/config.yml');
    fs.exists(srcCfgPath, function(exists){
        if(exists){
            var readStream = fs.createReadStream(srcCfgPath);
            var writeStream = fs.createWriteStream(targetCfgPath);
            readStream.pipe(writeStream);
        }
    })
})

//i18n
modules.forEach(function(module){
    var srci18nPath = path.join("src", module+'/i18n');
    var targeti18nPath = path.join("app", module+'/i18n');
    fs.exists(srci18nPath, function(exists){
        if(exists){
           copyForder(srci18nPath,targeti18nPath,)
        }
    })
})






