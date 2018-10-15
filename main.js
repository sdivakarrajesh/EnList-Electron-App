const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;
let mainWindow;
let addWindow;

process.env.NODE_ENV = 'development';
app.on('ready',function(){
    mainWindow = new BrowserWindow({});

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname,'mainwindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    mainWindow.on('closed', function () {
        app.quit();
    });
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);
});



function createAddWindow(){
    addWindow = new BrowserWindow({
        width:300,
        height:200,
        title:'Add Shopping List Item'
    });

    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    addWindow.on('close',function(){
        addWindow = null;
    });

}

ipcMain.on('item:add',function(e,item){
    mainWindow.webContents.send('item:add',item);
    addWindow.close();
});

const mainMenuTemplate = [
    {
        label: 'File',
        submenu:[
            {
                label:"Add item",
                click(){
                    createAddWindow();
                }
            },
            {
                label:"Clear Items",
                click(){
                    mainWindow.webContents.send('item:clear');
                }
            },{
                label:"Quit",
                accelerator: process.platform == "Darwin" ? "Command+Q" : "Ctrl+Q",
                click(){
                    app.quit();
                }
            }
        ]
    }
];

if(process.platform=="darwin"){
    mainMenuTemplate.unshift({});
}

if(process.env.NODE_ENV!="production"){
    mainMenuTemplate.push({
        label:"Developer Tools",
        submenu:[
            {
                label:'Toggle DevTools',
                accelerator: process.platform == "Darwin" ? "Command+I" : "Ctrl+I",
                click(item,focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },{
                role:'reload'
            }
        ]
    });
}