const GET_GUIDES_STRUCTURE = 'get_guides_structure'
const GET_GUIDES_PAGE = 'get_guides_page'
const ADD_GUIDES_PAGE = 'add_guides_page'
const UPDATE_GUIDES_PAGE = 'update_guides_page'
const DELETE_GUIDES_PAGE = 'delete_guides_page'

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getDateAsString() {
  return new Date().toISOString();
}

function getBoolean() {
  return Math.random() < 0.5;
}

function generateSettings(operation){
    settings = {}
    const layouts = [
        window.codioIDE.guides.structure.LAYOUT.L_1_PANEL,
        window.codioIDE.guides.structure.LAYOUT.L_2_PANELS,
        window.codioIDE.guides.structure.LAYOUT.L_3_COLUMNS,
        window.codioIDE.guides.structure.LAYOUT.L_3_CELL,
        window.codioIDE.guides.structure.LAYOUT.L_4_CELL
    ]    
    settings.layout = layouts[getRandomInt(layouts.length)]
    const pageTypes = [
        window.codioIDE.guides.structure.ITEM_TYPES.PAGE,
        window.codioIDE.guides.structure.ITEM_TYPES.SECTION,
        window.codioIDE.guides.structure.ITEM_TYPES.CHAPTER
    ]
    if(operation === 'add'){
        settings.type = pageTypes[getRandomInt(pageTypes.length)]
        settings.title = settings.type + ' ' + getDateAsString()
    }
    else if (operation === 'update'){
        settings.title = 'updated ' + getDateAsString()
    }
    else
        settings.title = 'unknown operation'

    settings.guidesOnLeft = getBoolean()
    settings.showFileTree = getBoolean()
    settings.teacherOnly = getBoolean()
    settings.closeAllTabs = getBoolean()
    settings.closeTerminalSession = getBoolean()
    settings.showFolders = ['folder ' + getDateAsString()] 
    settings.content = 'content ' + getDateAsString()
    settings.learningObjectives = 'learningObjectives ' + getDateAsString()
    const actionTypes = [
        window.codioIDE.guides.structure.ACTION_TYPE.FILE,
        window.codioIDE.guides.structure.ACTION_TYPE.PREVIEW,
        window.codioIDE.guides.structure.ACTION_TYPE.TERMINAL,
        window.codioIDE.guides.structure.ACTION_TYPE.HIGHLIGHT,
        window.codioIDE.guides.structure.ACTION_TYPE.VISUALIZER,
        window.codioIDE.guides.structure.ACTION_TYPE.VM,
        window.codioIDE.guides.structure.ACTION_TYPE.VM_TERMINAL,
        window.codioIDE.guides.structure.ACTION_TYPE.EARSKETCH,
        window.codioIDE.guides.structure.ACTION_TYPE.JUPYTER_LAB
    ]
    settings.actions = [{
        type: actionTypes[getRandomInt(actionTypes.length)],
        fileName: 'file' + getDateAsString(),
        url: 'file' + getDateAsString(),
        command: 'file' + getDateAsString(),
        reference: 'ref ' + getDateAsString(),
        lines: getRandomInt(10), 
        panel: getRandomInt(3)
    }]
    mediaActions = [
        window.codioIDE.guides.structure.MEDIA_ACTION_TYPE.FILE_OPEN,
        window.codioIDE.guides.structure.MEDIA_ACTION_TYPE.FILE_CLOSE,
        window.codioIDE.guides.structure.MEDIA_ACTION_TYPE.TERMINAL_OPEN,
        window.codioIDE.guides.structure.MEDIA_ACTION_TYPE.TERMINAL_CLOSE,
        window.codioIDE.guides.structure.MEDIA_ACTION_TYPE.RUN_COMMAND,
        window.codioIDE.guides.structure.MEDIA_ACTION_TYPE.HIGHLIGHT,
        window.codioIDE.guides.structure.MEDIA_ACTION_TYPE.CLOSE_ALL,
        window.codioIDE.guides.structure.MEDIA_ACTION_TYPE.PAUSE
    ]
    settings.media = {
        name: 'media name' + getDateAsString(),
        source: 'melody.mp3',
        disabled: getBoolean(),
        actions: [{
            type: mediaActions[getRandomInt(mediaActions.length)],
            time: getRandomInt(30),
            fileNameOrCommand: 'mediafile' + getDateAsString(),
            reference: 'mediareference' + getDateAsString(),
            lines: getRandomInt(10),
            panel: getRandomInt(4)
        }]
    }
    console.log('generated settings: ', settings)
    return settings
}

const getGuidesStructure = async () => {
      try {
        const structure = await window.codioIDE.guides.structure.getStructure()
        console.log('guides structure', structure)
      } catch (e) {
        console.error(e)
      }
}

const addGuidesPage = async () => {
    const structure = await window.codioIDE.guides.structure.getStructure()
    const lastIndex = structure.children.length
    parentId = null   

    try {
        const res = await window.codioIDE.guides.structure.add(generateSettings('add'), parentId, lastIndex)
        console.log('result: ', res)
    } catch (e) {
        console.error(e)
    }
}

const getGuidesPage = async () => {
    const structure = await window.codioIDE.guides.structure.getStructure()
    const latestPageId = structure.children[structure.children.length - 1].id
    try {
        const page = await window.codioIDE.guides.structure.get(latestPageId)
        console.log('get page: ', page)
    } catch (e) {
        console.error(e)
    }
}

const updateGuidesPage = async () => {
    const structure = await window.codioIDE.guides.structure.getStructure()
    const latestPageId = structure.children[structure.children.length - 1].id
    try {
        await window.codioIDE.guides.structure.update(latestPageId, generateSettings('update'))
        console.log('item updated')
    } catch (e) {
        console.error(e)
    }
}

const deleteGuidesPage = async () => {
    const structure = await window.codioIDE.guides.structure.getStructure()
    const latestPageId = structure.children[structure.children.length - 1].id

    try {
        await window.codioIDE.guides.structure.delete([latestPageId])
        console.log('remove items done')
    } catch (e) {
        console.error(e)
    }
}


const addMenuItem = (parentDescriptor, item) => {
  window.codioIDE.menu.addItem(parentDescriptor, item)
}

const style = `
    width: 140px;
    height: 110px;
    z-index: 10000;
    position: absolute;
    left: 30px;
    top: 600px;
    background-color: white;
    padding: 10px;
`

const init = () => {
    // Use actions from menu Codio/...
    addMenuItem({title: 'Codio'}, {id: GET_GUIDES_STRUCTURE, title: 'get guides structure', callback: getGuidesStructure})
    addMenuItem({title: 'Codio'}, {id: GET_GUIDES_PAGE, title: 'get guides page', callback: getGuidesPage})
    addMenuItem({title: 'Codio'}, {id: ADD_GUIDES_PAGE, title: 'add guides page', callback: addGuidesPage})
    addMenuItem({title: 'Codio'}, {id: UPDATE_GUIDES_PAGE, title: 'update guides page', callback: updateGuidesPage})
    addMenuItem({title: 'Codio'}, {id: DELETE_GUIDES_PAGE, title: 'delete guides page', callback: deleteGuidesPage})

    // Or use actions from custom area 
    const modal = document.createElement('div')
    modal.id = 'customModalId'
    modal.style = style
    const buttonGetStructure = document.createElement('button')
    const buttonGet = document.createElement('button')
    const buttonAdd = document.createElement('button')
    const buttonUpdate = document.createElement('button')
    const buttonDelete = document.createElement('button')
    buttonGetStructure.type = 'button'
    buttonGet.type = 'button'
    buttonAdd.type = 'button'
    buttonUpdate.type = 'button'
    buttonDelete.type = 'button'
    buttonGet.innerHTML = 'get guides page'
    buttonGetStructure.innerHTML = 'get guides structure'
    buttonAdd.innerHTML = 'add guides page'
    buttonUpdate.innerHTML = 'update guides page'
    buttonDelete.innerHTML = 'delete guides page'
    buttonGetStructure.onclick = () => {
        setTimeout(getGuidesStructure,500)
    }
    buttonGet.onclick = () => {
        setTimeout(getGuidesPage,500)
    }
    buttonAdd.onclick = () => {
        setTimeout(addGuidesPage,500)
    }
    buttonUpdate.onclick = () => {
        setTimeout(updateGuidesPage,500)
    }
    buttonDelete.onclick = () => {
        setTimeout(deleteGuidesPage,500)
    }
    modal.append(buttonGetStructure)
    modal.append(buttonGet)
    modal.append(buttonAdd)
    modal.append(buttonUpdate)
    modal.append(buttonDelete)
    document.querySelector('body').append(modal)
}

setTimeout(init, 500)