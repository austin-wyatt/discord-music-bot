import Dexie, { Collection, Table } from 'dexie'

export enum MediaType{
    LocalResource,
    YoutubeLink,
    MediaLink
}

//add local tracks mass import

interface TableNames{
    categories: Table,
    tracks: Table
}

//@ts-ignore, no
const db: Dexie & TableNames = new Dexie("Database");
db.version(1).stores({
    categories: '++id, name',
    tracks: '++id, url, displayname, categoryid'
})

db.on("populate", function() {
    // Init your DB with some default statuses:
    db.categories.add({id: 0, name: "Default"});
});

db.open()

export const addTrack = (url: string, displayName: string, categoryID: number, mediaType: MediaType, fnCallback: (addedItem: object) => void) => {
    db.tracks.add({url: url, displayname: displayName, categoryid: categoryID, mediatype: mediaType})
    .then(r => {
        console.log(r)
        getTrackByName(displayName, fnCallback);
    }).catch(e => {
        console.log(e);
    });
}

export const addCategory = (name: string, fnCallback: (addedItem: object) => void) => {
    db.categories.add({name: name})
    .then(r => {
        getCategoryByName(name, fnCallback)
    }).catch(e => {
        console.log(e);
    });
}

export const getCategoryByName = (name: string, fnCallback: (item: object) => void) => {
    db.categories.where('name').equals(name).first().then(item => {
        fnCallback(item);
    }).catch(e => {
        fnCallback(undefined);
    })
}

export const getCategoryByID = (id: number, fnCallback: (item: object) => void) => {
    return db.categories.where('id').equals(id).first().then(item => {
        fnCallback(item);
    }).catch(e => {
        fnCallback(undefined);
    })
}

export const getTrackByName = (name: string, fnCallback: (item: object) => void) => {
    return db.tracks.where('displayname').equals(name).first().then(item => {
        fnCallback(item);
    }).catch(e => {
        fnCallback(undefined);
    })
}

export const getTrackByID = (id: number, fnCallback: (item: object) => void) => {
    db.tracks.where('id').equals(id).first().then(item => {
        fnCallback(item);
    }).catch(e => {
        fnCallback(undefined);
    })
}

export const updateCategory = (id: number, category: Collection) => {
    db.categories.update(id, {name: name})
}

export const updateTrack = (id: number, track: Collection) => {
    db.tracks.update(id, track)
}

export const getAllCategories = (fnCallback: (items: object[]) => void) => {
    db.tracks.toArray().then(v => {
        fnCallback(v)
    }).catch(e => {
        fnCallback([])
    })
}

export const getAllTracks = (fnCallback: (items: object[]) => void) => {
    db.tracks.toArray().then(v => {
        fnCallback(v)
    }).catch(e => {
        fnCallback([])
    })
}