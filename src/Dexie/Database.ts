import Dexie, { Collection, Table } from 'dexie'
import { Category, MediaType, Server, Track } from '../types';

//add local tracks mass import

interface TableNames{
    categories: Table,
    tracks: Table,
    servers: Table
}

//@ts-ignore, no
const db: Dexie & TableNames = new Dexie("Database");
db.version(1).stores({
    categories: '++id, name',
    tracks: '++id, url, displayname, categoryid'
})

db.version(2).stores({
    categories: '++id, name',
    tracks: '++id, url, displayname, categoryid',
    servers: '++id, &guildid, name'
})

db.on("populate", function() {
    db.categories.add({id: 0, name: "Default", expanded: true});
});

db.open()

export const addTrack = (track: Track, fnCallback?: (addedItem: Track) => void) => {
    db.tracks.add({url: track.url, displayname: track.displayname, categoryid: track.categoryid, mediatype: track.mediatype})
    .then(r => {
        getTrackByName(track.displayname, fnCallback);
    }).catch(e => {
        console.log(e);
    });
}

export const addCategory = (category: Category, fnCallback?: (addedItem: Category) => void) => {
    db.categories.add({name: category.name, expanded: category.expanded})
    .then(r => {
        getCategoryByName(category.name, fnCallback)
    }).catch(e => {
        console.log(e);
    });
}

export const getCategoryByName = (name: string, fnCallback: (item: Category) => void) => {
    db.categories.where('name').equals(name).first().then(item => {
        fnCallback(item);
    }).catch(e => {
        fnCallback(undefined);
    })
}

export const getCategoryByID = (id: number, fnCallback: (item: Category) => void) => {
    return db.categories.where('id').equals(id).first().then(item => {
        fnCallback(item);
    }).catch(e => {
        fnCallback(undefined);
    })
}

export const getTrackByName = (name: string, fnCallback: (item: Track) => void) => {
    return db.tracks.where('displayname').equals(name).first().then(item => {
        fnCallback(item);
    }).catch(e => {
        fnCallback(undefined);
    })
}

export const getTrackByID = (id: number, fnCallback: (item: Track) => void) => {
    db.tracks.where('id').equals(id).first().then(item => {
        fnCallback(item);
    }).catch(e => {
        fnCallback(undefined);
    })
}

export const getTracksByCategoryID = (id: number, fnCallback: (item: Track[]) => void) => {
    db.tracks.where('categoryid').equals(id).toArray().then(item => {
        fnCallback(item);
    }).catch(e => {
        fnCallback(undefined);
    })
}

export const updateCategory = (category: Category, fnCallback?: () => void) => {
    db.categories.where(":id").equals(category.id).modify(category).then(fnCallback).catch(fnCallback)
}

export const updateTrack = (track: Track, fnCallback?: () => void) => {
    db.tracks.where(":id").equals(track.id).modify(track).then(fnCallback).catch(fnCallback)
}

export const getAllCategories = (fnCallback: (items: Category[]) => void) => {
    db.categories.toArray().then(v => {
        fnCallback(v)
    }).catch(e => {
        fnCallback([])
    })
}

export const getAllTracks = (fnCallback: (items: Track[]) => void) => {
    db.tracks.toArray().then(v => {
        fnCallback(v)
    }).catch(e => {
        fnCallback([])
    })
}

export const deleteTracks = (items: number[], fnCallback: () => void) => {
    db.tracks.bulkDelete(items).then(fnCallback).catch(fnCallback)
}

export const deleteCategories = (items: number[], fnCallback: () => void) => {
    items = items.filter(i => i != 0) //Default can't be deleted
    db.categories.bulkDelete(items).then(fnCallback).catch(fnCallback)

    items.forEach(i => {
        getTracksByCategoryID(i, tracks => {
            console.log(tracks)
            deleteTracks(tracks.map(t => t.id), () => {})
        })
    })
}

export const addServer = (server: Server, fnCallback: (server?: Server) => void) => {
    db.servers.add({name: server.name, guildid: server.guildid})
    .then(r => {
        getServerByName(server.name, fnCallback)
    }).catch(e => {
        fnCallback()
    });
}

export const getServerByName = (name: string, fnCallback: (item: Server) => void) => {
    db.servers.where('name').equals(name).first().then(item => {
        fnCallback(item);
    }).catch(e => {
        fnCallback(undefined);
    })
}

export const getServerByGuildID = (id: number, fnCallback: (item: Server) => void) => {
    db.servers.where('guildid').equals(id).first().then(item => {
        fnCallback(item);
    }).catch(e => {
        fnCallback(undefined);
    })
}

export const getServers = (fnCallback: (items: Server[]) => void) => {
    db.servers.toArray().then(items => {
        fnCallback(items);
    }).catch(e => {
        fnCallback(undefined);
    })
}

export const deleteServers = (items: number[], fnCallback: () => void) => {
    db.servers.bulkDelete(items).then(fnCallback).catch(fnCallback)
}