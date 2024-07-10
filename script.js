document.addEventListener('DOMContentLoaded', () => {
    let folderCounter = 0;
    let noteCounter = 0;
    let currentFolder = null;
    let currentNote = null;
    // let isCollapsed = false;

    const centerBottom = document.getElementById('centerbottom');
    const rightDiv = document.getElementById('right');
    const topDiv = document.getElementById('top');
    const newFolderButton = document.querySelectorAll('#centertop button')[1];
    const newNoteButton = document.querySelectorAll('#centertop button')[0];
    // const centerDiv = document.getElementById('center');
    // const centertop = document.getElementById('centertop');



    function createFolder() {
        folderCounter++;
        const folder = document.createElement('div');
        folder.className = 'folder';
        folder.textContent = `Folder${folderCounter}`;
        folder.dataset.folderId = folderCounter;
        folder.addEventListener('click', () => {
            event.stopPropagation();
            selectFolder(folder);
        });
        centerBottom.appendChild(folder);
        selectFolder(folder);
    }

    function createNote() {
        if (!currentFolder) {
            alert('Please select a folder first.');
            return;
        }
        noteCounter++;
        const note = document.createElement('div');
        note.className = 'note';
        note.textContent = `Untitled${noteCounter}`;
        note.dataset.noteId = noteCounter;
        note.dataset.folderId = currentFolder.dataset.folderId;
        note.dataset.content = '';
        note.addEventListener('click', () => {
            event.stopPropagation();
            selectNote(note);
        });
        currentFolder.appendChild(note);
        selectNote(note);
    }

    function selectFolder(folder) {
        if (currentFolder) currentFolder.classList.remove('selected');
        currentFolder = folder;
        currentFolder.classList.add('selected');
        currentNote.style.backgroundColor = 'rgb(39, 39, 39)';
        const previousTab = document.querySelector(`.tab[data-note-id="${currentNote.dataset.noteId}"]`);
        if (previousTab) previousTab.style.backgroundColor = 'rgb(55, 55, 55)';
        currentNote = null;
        updateRightDiv();
    }

    // function selectNote(note) {
    //     if (currentNote) {
    //         currentNote.classList.remove('selected');
    //         currentNote.style.backgroundColor = 'rgb(39, 39, 39)';
    //     }
    //     currentNote = note;
    //     currentNote.classList.add('selected');
    //     currentNote.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';

    //     updateRightDiv();
    //     addNewTab(note);
    // }

    function selectNote(note) {
        if (currentNote) {
            currentNote.classList.remove('selected');
            currentNote.style.backgroundColor = 'rgb(39, 39, 39)';
            const previousTab = document.querySelector(`.tab[data-note-id="${currentNote.dataset.noteId}"]`);
            if (previousTab) previousTab.style.backgroundColor = 'rgb(55, 55, 55)';
            // background-color: rgb(55, 55, 55);

        }
        currentNote = note;
        currentNote.classList.add('selected');
        currentNote.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';

        const currentTab = document.querySelector(`.tab[data-note-id="${currentNote.dataset.noteId}"]`);
        if (currentTab) currentTab.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';

        updateRightDiv();
        addNewTab(note);
    }




    function updateRightDiv() {
        if (currentNote) {
            const noteContent = document.createElement('div');
            noteContent.contentEditable = true;
            noteContent.className = 'note-content';
            noteContent.textContent = currentNote.dataset.content || '';
            noteContent.addEventListener('input', () => {
                currentNote.dataset.content = noteContent.textContent;
            });

            const noteTitle = document.createElement('div');
            noteTitle.contentEditable = true;
            noteTitle.className = 'note-title';
            noteTitle.textContent = currentNote.textContent;
            noteTitle.addEventListener('input', () => {
                currentNote.textContent = noteTitle.textContent;
                const tab = document.querySelector(`.tab[data-note-id="${currentNote.dataset.noteId}"]`);
                if (tab) tab.textContent = noteTitle.textContent;
            });

            rightDiv.innerHTML = '';
            rightDiv.appendChild(noteTitle);
            rightDiv.appendChild(noteContent);
        } else {
            const openTabs = topDiv.querySelectorAll('.tab');
            if (openTabs.length > 0) {
                const lastTab = openTabs[openTabs.length - 1];
                const noteId = lastTab.dataset.noteId;
                const note = document.querySelector(`.note[data-note-id="${noteId}"]`);
                if (note) {
                    const noteContent = document.createElement('div');
                    noteContent.contentEditable = true;
                    noteContent.className = 'note-content';
                    noteContent.textContent = note.dataset.content || '';
                    noteContent.addEventListener('input', () => {
                        note.dataset.content = noteContent.textContent;
                    });

                    const noteTitle = document.createElement('div');
                    noteTitle.contentEditable = true;
                    noteTitle.className = 'note-title';
                    noteTitle.textContent = note.textContent;
                    noteTitle.addEventListener('input', () => {
                        note.textContent = noteTitle.textContent;
                        lastTab.textContent = noteTitle.textContent;
                    });

                    rightDiv.innerHTML = '';
                    rightDiv.appendChild(noteTitle);
                    rightDiv.appendChild(noteContent);
                }
            } else {
                rightDiv.innerHTML = '<div class="no-file">No file is open</div>';
            }
        }
    }

    function addNewTab(note) {
        if (document.querySelector(`.tab[data-note-id="${note.dataset.noteId}"]`)) return;

        const tab = document.createElement('div');
        tab.className = 'tab';
        tab.innerHTML = note.textContent + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
        tab.style.cursor = 'pointer';
        tab.dataset.noteId = note.dataset.noteId;
        tab.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';

        tab.addEventListener('click', () => {
            const selectedNote = document.querySelector(`.note[data-note-id="${tab.dataset.noteId}"]`);
            if (selectedNote) {
                selectNote(selectedNote);
            }

            tab.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
        });

        const closeButton = document.createElement('span');
        closeButton.innerHTML = 'x'
        closeButton.style.cursor = 'default';
        closeButton.addEventListener('click', (event) => {
            event.stopPropagation();
            tab.remove();
            currentNote.style.backgroundColor = 'rgb(39, 39, 39)';

            const remainingTabs = topDiv.querySelectorAll('.tab');
            if (remainingTabs.length > 0) {
                const lastTab = remainingTabs[remainingTabs.length - 1];
                const noteId = lastTab.dataset.noteId;
                const note = document.querySelector(`.note[data-note-id="${noteId}"]`);
                if (note) {
                    selectNote(note);
                }
            } else {
                currentNote = null;
                rightDiv.innerHTML = '<div class="no-file">No file is open</div>';
            }
        });

        tab.appendChild(closeButton);
        topDiv.appendChild(tab);
    }


    function deleteSelected() {
        if (currentNote) {
            const tab = document.querySelector(`.tab[data-note-id="${currentNote.dataset.noteId}"]`);
            if (tab) tab.remove();
            currentNote.remove();
            currentNote = null;
        } else if (currentFolder) {
            const notes = currentFolder.querySelectorAll('.note');
            notes.forEach(note => {
                const tab = document.querySelector(`.tab[data-note-id="${note.dataset.noteId}"]`);
                if (tab) tab.remove();
                note.remove();
            });
            currentFolder.remove();
            currentFolder = null;
        }
        updateRightDiv();
    }

    newFolderButton.addEventListener('click', createFolder);
    newNoteButton.addEventListener('click', createNote);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Delete') {
            deleteSelected();
        }
    });

    updateRightDiv();
});

let isCollapsed = false;

const centerDiv = document.getElementById('center');
const rightDiv = document.getElementById('right');
const collapseButton = document.getElementById('collapse-button');
const centertop = document.getElementById('centertop');
const centerBottom = document.getElementById('centerbottom');



collapseButton.addEventListener('click', () => {
    isCollapsed = !isCollapsed;

    if (isCollapsed) {
        centerDiv.style.width = '0';
        rightDiv.style.width = 'calc(100% - 45px)';
        centertop.style.display = 'none';
        centerBottom.style.display = 'none'
    } else {
        centerDiv.style.width = '300px';
        rightDiv.style.width = 'calc(100% - 45px - 300px)';
        centertop.style.display = 'flex';
        centerBottom.style.display = 'block';

    }
});