import { typeOf, IsType, _insertAfter, _listen, _isEmptyObject } from './util/index';

// https://stackoverflow.com/questions/30174078/how-to-define-singleton-in-typescript
// http://www.codebelt.com/typescript/typescript-singleton-pattern/
class Console {
  private static log: Console;

  private constructor() {};

  private static DOM_NODE: HTMLElement = document.body;

  private Folders_listeners: Function[] = [];
  private array_tabs_count: number = 0;
  private object_tabs_count: number = 0;
  static render(node?: HTMLElement) {
    if (!Console.log) Console.log = new Console();
    if (node) Console.DOM_NODE = node;
    return Console.log;
  }

  log(msg: any) {
    // console.log(typeOf(msg))
    console.log(msg)

    let li = document.createElement('li');
    li.className = 'output-li';
    let timeLine = this._createTimeLine();
    li.appendChild(timeLine);

    if(typeOf(msg) === IsType[0]){
      let str = this._createString(msg);
      li.appendChild(str);
    }else if(typeOf(msg) === IsType[1]){
      let num = this._createNumber(msg);
      li.appendChild(num);
    }else if(typeOf(msg) === IsType[2]){
      let bool = this._createBoolean(msg);
      li.appendChild(bool);
    }else if(typeOf(msg) === IsType[3] || typeOf(msg) === IsType[4]){
      let nulld = this._createNull(msg);
      li.appendChild(nulld);
    }else if(typeOf(msg) === IsType[5]){
      this.array_tabs_count = 0;
      this.object_tabs_count = 0;
      let array = this._createArray(msg);
      li.appendChild(array);
    }else if(typeOf(msg) === IsType[6] || typeOf(msg) === IsType[8] || typeOf(msg) === IsType[9]){//Object Window MouseEvent
      this.array_tabs_count = 0;
      this.object_tabs_count = 0;
      let obj = this._createObject(msg);
      li.appendChild(obj);
    }else if(typeOf(msg) === IsType[7]){
      let fun = this._createFunction(msg);
      li.appendChild(fun);
    }/* else if(typeOf(msg) === IsType[10]){// Error
      let str = this._createString('Error');
      li.appendChild(str);
    }else if(typeOf(msg) === IsType[11]){// HTMLDocument
      let str = this._createString('document 相关请直接查看浏览器自带Elements面板');
      li.appendChild(str);
    } */

    Console.DOM_NODE.appendChild(li);
  }

  private _createSimpleString(str: string) {
    let fragment = document.createDocumentFragment()
    let string = document.createElement('span');
    string.className = '_stringSimple';
    string.innerHTML = str;
    fragment.appendChild(string);
    return fragment;
  }

  private _createString(str: string){
    let fragment = document.createDocumentFragment()
    let start = this._createCommon('"');
    let end = this._createCommon('"');
    let string = document.createElement('span');
    string.className = '_string';
    string.innerHTML = str;
    fragment.appendChild(start);
    fragment.appendChild(string);
    fragment.appendChild(end);
    return fragment;
  }

  private _createNumber(num: number){
    let number = document.createElement('span');
    number.className = '_number';
    number.innerHTML = `${num}`;
    return number;
  }

  private _createBoolean(bool: boolean){
    let boolean = document.createElement('span');
    boolean.className = '_boolean';
    boolean.innerHTML = `${bool}`;
    return boolean;
  }

  private _createNull(msg: null|undefined){
    let nulld = document.createElement('span');
    nulld.className = '_null';
    if(typeOf(msg) === IsType[3]){
      nulld.innerHTML = 'null';
    }else if(typeOf(msg) === IsType[4]){
      nulld.innerHTML = 'undefined';
    }
    return nulld;
  }
  private _funcToString(fun: Function){
    var str = fun.toString()
      .replace(/\r/g,'')
      .replace(/\n/g,'')
      .replace(/\t/g,'')
      .replace(/( ){2,}/g,'')
    return str;
  }
  private _createFunction(fun: Function){
    var fragment = document.createDocumentFragment();
    let funcMark = document.createElement('span');
    funcMark.className = '_function';
    let spaces = this._createSpace(8);
    spaces.className = '_timeLine';
    let str = this._funcToString(fun);
    funcMark.innerHTML = `${str.slice(0,8)}`;
    var funcSpan = document.createElement('span');
    funcSpan.className = 'common'
    funcSpan.innerHTML = ` ${str.slice(9,str.indexOf('{'))}`;
    funcSpan.title = ` ${str}`;
    fragment.appendChild(funcMark);
    fragment.appendChild(funcSpan);
    return fragment;
  }

  private _createArray(arr: any[]){
    let start = this._createCommon('[');
    let end = this._createCommon(']');
    let folderSpan = document.createElement('span');
    var fragment = document.createDocumentFragment();
    folderSpan.className = '_ArrayFolder';
    let triangle;
    if(arr.length !== 0){
      triangle = this._createTriangle();
    }else{
      triangle = document.createElement('span');
      triangle.innerHTML = 'Array'
    };
    let arrLen = document.createElement('span');
    arrLen.className = '_public';
    arrLen.innerHTML = `(${arr.length}) `
    folderSpan.appendChild(triangle);
    folderSpan.appendChild(arrLen);
    folderSpan.appendChild(start);
    let hasClick: boolean = false;
    if(arr.length !== 0){
      let len = 0;
      let undefined_repeat_pos = -1;let  null_repeat_pos = -1;
      let undefined_repeat_times = 1;let null_repeat_times = 1;
      let undefined_hasRepeat = false;let null_hasRepeat = false;
      /* ergodic the Array's empty index*/
      for(let key of arr){ // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of
        len++;
        if(typeOf(key) === IsType[0]){
          let str = this._createString(key);
          folderSpan.appendChild(str);
        }else if(typeOf(key) === IsType[1]){
          let num = this._createNumber(key);
          folderSpan.appendChild(num);
        }else if(typeOf(key) === IsType[2]){
          let bool = this._createBoolean(key);
          folderSpan.appendChild(bool);
        }else if(typeOf(key) === IsType[3]){
          let nulld = this._createNull(key);
          if(len -1 !== 0 && null_repeat_pos + 1 === len -1){
            null_repeat_times++;
          }
          if(null_repeat_times === 1 || null_repeat_pos === -1){
            folderSpan.appendChild(nulld);
            if(arr[len-1] === arr[len]){
              null_hasRepeat = true;
            }else{
              null_hasRepeat = false;
            }
          }else if(null_repeat_times !== 1 && (len === arr.length || arr[len-1] !== arr[len])){
            let repeatSpan = document.createElement('span');
            repeatSpan.className = '_null _count';
            repeatSpan.innerHTML = ` × ${null_repeat_times}`;
            folderSpan.appendChild(repeatSpan);
            null_repeat_times = 1;
            null_hasRepeat = false;
          }
          null_repeat_pos = len - 1;
        }else if(typeOf(key) === IsType[4]){
          let nulld = this._createNull(key);
          if(len -1 !== 0 && undefined_repeat_pos + 1 === len -1){
            undefined_repeat_times++;
          }
          if(undefined_repeat_times === 1 || undefined_repeat_pos === -1){
            folderSpan.appendChild(nulld);
            if(arr[len-1] === arr[len]){
              undefined_hasRepeat = true;
            }else{
              undefined_hasRepeat = false;
            }

          }else if(undefined_repeat_times !== 1 && (len === arr.length || arr[len-1] !== arr[len])){
            let repeatSpan = document.createElement('span');
            repeatSpan.className = '_null _count';
            repeatSpan.innerHTML = ` × ${undefined_repeat_times}`;
            folderSpan.appendChild(repeatSpan);
            undefined_repeat_times = 1;
            undefined_hasRepeat = false;
          }
          undefined_repeat_pos = len - 1;
        }else if(typeOf(key) === IsType[5]){
          let span = document.createElement('span');
          span.className = '_common';
          span.innerHTML = `Array(${key.length})`;
          folderSpan.appendChild(span);
        }else if(typeOf(key) === IsType[6]){
          let span = document.createElement('span');
          span.className = '_public';
          span.title = 'Object';
          span.innerHTML = `{…}`;
          folderSpan.appendChild(span);
        }else if(typeOf(key) === IsType[7]){
          let span = document.createElement('span');
          span.className = '_public';
          span.title = 'Function';
          span.innerHTML = `∱`;
          folderSpan.appendChild(span);
        }
        if(len !== arr.length && undefined_repeat_times === 1 && !undefined_hasRepeat && null_repeat_times === 1 && !null_hasRepeat ){
          let comma = this._createComma();
          folderSpan.appendChild(comma);
        }
      }

      let Array_listener = _listen(folderSpan, 'click', (event: MouseEvent)=>{
        let targetElement: any;
        if(event.srcElement.parentElement.className.indexOf('_ArrayFolder') >= 0){
          targetElement = event.srcElement.parentElement.parentElement;
          targetElement.classList.toggle('_toggle-div');
          folderSpan.classList.toggle('_toggle-folder');
        }
      })
      this.Folders_listeners.push(Array_listener)
    }
    folderSpan.appendChild(end);
    fragment.appendChild(folderSpan);

    let folder_div = this._createFolder(arr);
    fragment.appendChild(folder_div);
    if(arr.length > 0) this.array_tabs_count--
    return fragment;
  }
  private _createFolder(arr: any[]|Object){
    let folder_div = document.createElement('div');
    folder_div.className = '_folder-div';

    for(let key in arr){
      let div = document.createElement('div');
      let tabs = this._createTabs((this.array_tabs_count + this.object_tabs_count))

      let timeLine = this._createSpace(8);
      timeLine.className = '_timeLine';
      /* TODO: ADD Miult Array */
      let variable = this._createVariable(key);
      let colon = this._createCommon(': ');
      let value
      if(typeOf(arr[key]) === IsType[0]){
        value = this._createString(arr[key]);
      }else if(typeOf(arr[key]) === IsType[1]){
        value = this._createNumber(arr[key]);
      }else if(typeOf(arr[key]) === IsType[2]){
        value = this._createBoolean(arr[key]);
      }else if(typeOf(arr[key]) === IsType[3] || typeOf(arr[key]) === IsType[4]){
        value = this._createNull(arr[key]);
      }else if(typeOf(arr[key]) === IsType[5]){
        if(arr[key].length > 0) this.array_tabs_count++
        value = this._createArray(arr[key])
      }else if(typeOf(arr[key]) === IsType[6]){
        if(!_isEmptyObject(arr[key])) this.object_tabs_count++
        value = this._createObject(arr[key])
      }else if(typeOf(arr[key]) === IsType[7]){
        value = this._createFunction(arr[key])
      }else{
        value = document.createDocumentFragment()
      }
      div.appendChild(timeLine);
      div.appendChild(tabs);
      div.appendChild(variable);
      div.appendChild(colon);
      div.appendChild(value);
      folder_div.appendChild(div);
    }

    return folder_div;
  }

  private _createTabs(tabs: number = 0){
    let spaces = document.createDocumentFragment()
    for(var tab = 0; tab < tabs; tab++){
      let space = document.createElement('span')
      space.innerHTML = '&nbsp;&nbsp;'
      space.className = '_tabs';
      spaces.appendChild(space)
    }
    return spaces;
  }

  private _createVariable(innerHTML: string|number){
    let variable = document.createElement('span');
    variable.className = '_variable';
    variable.innerHTML = `${innerHTML}`;
    return variable;
  }

  private _createObject(obj: object){
    var fragment = document.createDocumentFragment();
    let folderSpan = document.createElement('span');
    folderSpan.className = '_ObjectFolder';
    let start = this._createCommon(' Object {');
    let end = this._createCommon('}');
    if (!_isEmptyObject(obj)){
      let triangle = this._createTriangle();
      folderSpan.appendChild(triangle);
    }
    folderSpan.appendChild(start);
    let loopCount = 0;
    let objKeys = Object.keys(obj);
    for(let key in obj){
      if(++loopCount >= 6) break;
      let keySpan = document.createElement('span');
      keySpan.innerHTML = `${key}: `;
      keySpan.className = '_public';
      let value;
      if(typeOf(obj[key]) === IsType[0]){
        value = this._createString(obj[key])
      }else if(typeOf(obj[key]) === IsType[1]){
        value = this._createNumber(obj[key])
      }else if(typeOf(obj[key]) === IsType[2]){
        value = this._createBoolean(obj[key])
      }else if(typeOf(obj[key]) === IsType[3] || typeOf(obj[key]) === IsType[4]){
        value = this._createNull(obj[key])
      }else if(typeOf(obj[key]) === IsType[5]){
        value = document.createElement('span');
        value.className = '_common';
        value.innerHTML = `Array(${obj[key].length})`;
      }else if(typeOf(obj[key]) === IsType[6]){
        value = document.createElement('span');
        value.className = '_public';
        value.title = 'Object';
        value.innerHTML = `{…}`;
      }else if(typeOf(obj[key]) === IsType[7]){
        value = document.createElement('span');
        value.className = '_public';
        value.title = 'Function';
        value.innerHTML = `∱`;
      }else{
        value = document.createDocumentFragment();
      }

      let comma = this._createComma();
      folderSpan.appendChild(keySpan);
      folderSpan.appendChild(value);
      if(objKeys[objKeys.length -1] !== key) folderSpan.appendChild(comma);
    }

    if(!_isEmptyObject(obj) && loopCount == 6){
      let ellipsis = document.createElement('span');
      ellipsis.className = '_public';
      ellipsis.innerHTML = '…';
      folderSpan.appendChild(ellipsis);
    }
    folderSpan.appendChild(end);
    fragment.appendChild(folderSpan)
    let div = this._createFolder(obj);
    fragment.appendChild(div);

    let Object_listener = _listen(folderSpan, 'click', (event: MouseEvent)=>{
      let targetElement: any;
      if(event.srcElement.parentElement.className.indexOf('_ObjectFolder') >= 0){
        targetElement = event.srcElement.parentElement.parentElement;
        targetElement.classList.toggle('_toggle-div');
        folderSpan.classList.toggle('_toggle-folder');
      }
    })
    this.Folders_listeners.push(Object_listener);
    if(!_isEmptyObject(obj)){
      this.object_tabs_count--
    }
    return fragment;
  }

  /* timeline: 时间线 */
  private _createTimeLine(){
    let time = new Date();
    let timeSpan = document.createElement('span');
    timeSpan.className = '_timeLine';
    timeSpan.innerHTML = `${time.getHours()}:${time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()}:${time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds()}.${time.getMilliseconds() < 10 ? '00' + time.getMilliseconds() : (time.getMilliseconds() < 100 ? '0' + time.getMilliseconds() : time.getMilliseconds())}&nbsp;`;
    return timeSpan;
  }

  private _createCommon(innerHTML: string){
    let common = document.createElement('span');
    common.className = 'common';
    common.innerHTML = innerHTML;
    return common;
  }

  private _createComma(){
    let comma = document.createElement('span');
    comma.className = '_commom';
    comma.innerHTML = ', ';
    return comma;
  }

  private _createSpace(times = 1){
    let space = ''
    let spaceSpan = document.createElement('span');
    for(let i = 0;i < times; i++){
      space+='&nbsp;'
    }
    spaceSpan.innerHTML = space;
    return spaceSpan;
  }

  private _createTriangle(){
    let folder = document.createElement('span');
    folder.innerHTML = '▶';
    folder.className = '_folder-triangle';
    return folder;
  }
}

export default Console
// let console = Console.render()
export { /* console,  */Console as ConsoleInDom }