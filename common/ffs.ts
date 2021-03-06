import * as fs from 'fs'
import * as path from 'path'
import {handleHtmlPage,handleScriptPage} from './parseFile'

let inputFile = "D:\\project\\v3Usb";
let outputFile = "C:\\Users\\ye\\Documents\\cam"




const map =new Map<string,string>();
map.set("./background/background.html","./main_background.js");
map.set("./setting/setting.html","./main_setting.js");
map.set("./setting/setup.html","./main_setup.js")
map.set("./popup/popup.html","./main_pop.js")

const jsScripts = ["./foreground/myjs.js","./common/jquery.js"]


const pathMap =new Map<string,string>();



export function doFile(){
    for (let [key, value] of map.entries()) {
        pathMap.set( path.join(inputFile,key),path.join(outputFile,value));
    }
    for(let i = 0;i<jsScripts.length;i++){
        let a = path.join(inputFile,jsScripts[i]) ;
        jsScripts[i] = a;
    }
    copyFolder(inputFile,outputFile)
}






function copyFolder(inputFile:string,outputFile:string){



    if(!fs.existsSync(inputFile)){
        throw new Error("there is no "+inputFile)
    }

    if(fs.existsSync(outputFile)){
        deleteFolderRecursive(outputFile);
    }

    let stats = fs.statSync(inputFile);

    if (stats.isDirectory()){
        
        fs.mkdirSync(outputFile,0o777);

        let files = fs.readdirSync(inputFile);
        files.forEach(function(file,index){
            let from = path.join(inputFile,file);
            let to = path.join(outputFile,file);
            copyFolder(from,to)
    
        });

    }else{
        if(inputFile.endsWith(".html")){
            if(pathMap.has(inputFile)){
                let outScript = pathMap.get(inputFile);
                handleHtmlPage(inputFile,outScript,outputFile)
            }
            
        }else if(inputFile.endsWith(".js")){
            if(jsScripts.indexOf(inputFile)>-1){              
                handleScriptPage(inputFile,outputFile)
            }

        }else{
            let text = fs.readFileSync(inputFile);
            fs.writeFileSync(outputFile, text);
        }


    }


}



function deleteFolderRecursive (url:string):void {
      var files = [];
      //判断给定的路径是否存在
      if( fs.existsSync(url) ) {
        //返回文件和子目录的数组
        files = fs.readdirSync(url);
        files.forEach(function(file,index){
          // var curPath = url + "/" + file;
          var curPath = path.join(url,file);
          //fs.statSync同步读取文件夹文件，如果是文件夹，在重复触发函数
          if(fs.statSync(curPath).isDirectory()) { // recurse
            deleteFolderRecursive(curPath);
          // 是文件delete file
          } else {
            fs.unlinkSync(curPath);
          }
        });
        //清除文件夹
        fs.rmdirSync(url);
      }else{
        console.log("给定的路径不存在，请给出正确的路径");
      }
    };