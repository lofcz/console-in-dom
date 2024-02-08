declare class Console {
    private static log;
    private constructor();
    private static DOM_NODE;
    private Folders_listeners;
    private array_tabs_count;
    private object_tabs_count;
    static render(node?: HTMLElement): Console;
    log(msg: any): void;
    private _createSimpleString;
    private _createString;
    private _createNumber;
    private _createBoolean;
    private _createNull;
    private _funcToString;
    private _createFunction;
    private _createArray;
    private _createFolder;
    private _createTabs;
    private _createVariable;
    private _createObject;
    private _createTimeLine;
    private _createCommon;
    private _createComma;
    private _createSpace;
    private _createTriangle;
}
export default Console;
export { /* console,  */ Console as ConsoleInDom };
