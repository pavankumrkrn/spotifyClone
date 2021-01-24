const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));
const userId =localStorage.getItem('userId');
const database = firebase.database();
const userRef = database.ref('users');
const playlistRef = database.ref('playlists');
const songRef = database.ref('songs');
const createElement = (element, className = '', id) => {
    let ele = document.createElement(element);
    ele.setAttribute('class', className);
    ele.id = id;
    return ele
}
const createTD = (text, cursor='') => {
    let td = createElement('td', 'text-center '+cursor);
    td.innerText = text;
    return td;
}

const addSong = (playlistId) => {

}

const triggerButton = () => {
    document.getElementById("modalButton").click()
}

const logout = () => {
    localStorage.clear();
    window.open('index.html', '_self');
}

const toggle = (val) => {
    if (val == 'home') {
        document.getElementById('tracksDiv').setAttribute('style', 'display: none');
        document.getElementById('playlists').setAttribute('style', 'display: none');
        document.getElementById('browseBlock').setAttribute('style', 'display: none');
        document.getElementById('homeBlock').setAttribute('style', 'display: block');
    }
    else {
        document.getElementById('tracksDiv').setAttribute('style', 'display: none');
        document.getElementById('playlists').setAttribute('style', 'display: none');
        document.getElementById('browseBlock').setAttribute('style', 'display: block');
        document.getElementById('homeBlock').setAttribute('style', 'display: none');
    }
    if (document.querySelector('.liActive')) {
        document.querySelector('.liActive').classList.remove('liActive');
    }
    document.getElementById(val).classList.add('liActive')
}

const renderPlaylist = async (genreId) => {
    const limit = 10;

    const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token }
    });

    const data = await result.json();
    let playlists = data.playlists.items;
    document.getElementById('playlistRow').innerHtml = ''
    playlists.forEach(p => {
        let col = createElement('div', 'col-sm-3 mt-2');
        let card = createElement('div', 'card bg-dark');
        card.onclick = () => {
            renderTracks(p, 'fromAsync')
        }
        let cardTitle = createElement('div', 'card-title');
        let p1 = createElement('p', 'h6 normal mt-2 ml-2');
        p1.innerText = p.name;
        cardTitle.append(p1)
        let img = createElement('img', 'card-img-top');
        img.setAttribute('src', p.images[0].url);
        let cardText = createElement('div', 'card-text');
        let para = createElement('p', 'h6 normal mt-2 ml-2')
        para.innerText = p.description
        cardText.append(para)
        card.append(cardTitle, img, cardText);
        col.append(card);
        document.getElementById('playlistRow').append(col);
    })
}

const getGenres = async (token) => {
    const result = await fetch(`https://api.spotify.com/v1/browse/categories?locale=sv_US`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token }
    });

    const data = await result.json();
    const genres = data.categories.items;
    const genrePacks = [], browsePacks = [];
    for (let i = 0; i <= 11; i += 4) {
        let pack = []
        pack.push(genres[i])
        pack.push(genres[i + 1])
        pack.push(genres[i + 2])
        pack.push(genres[i + 3])
        genrePacks.push(pack)
    }
    for (let i = 19; i >= 0; i -= 4) {
        let pack = []
        pack.push(genres[i])
        pack.push(genres[i - 1])
        pack.push(genres[i - 2])
        pack.push(genres[i - 3])
        browsePacks.push(pack)
    }
    let count = 1;
    genrePacks.forEach((p) => {
        p.forEach(g => {
            let col = createElement('div', 'col-sm-3');
            let card = createElement('div', 'card bg-dark');
            card.onclick = () => {
                document.getElementById('genreTitle').innerText = g.name + ' - Playlists';
                document.getElementById('homeBlock').setAttribute('style', 'display: none');
                document.getElementById('playlists').setAttribute('style', 'display: block');
                document.getElementById('playlistRow').innerHtml = ''
                renderPlaylist(g.id)
            }
            let img = createElement('img', 'card-img-top');
            img.setAttribute('src', g.icons[0].url);
            let cardText = createElement('div', 'card-text');
            let p = createElement('p', 'h6 normal mt-2 ml-2')
            p.innerText = g.name
            cardText.append(p)
            card.append(img, cardText);
            col.append(card);
            document.getElementById('row' + count).append(col)
        });
        count++
    });
    let browseCount = 0
    browsePacks.forEach((p) => {
        browseCount++
        p.forEach(g => {
            let col = createElement('div', 'col-sm-3 mt-3');
            let card = createElement('div', 'card bg-dark');
            card.onclick = () => {
                document.getElementById('genreTitle').innerText = g.name + ' - Playlists';
                document.getElementById('browseBlock').setAttribute('style', 'display: none');
                document.getElementById('playlists').setAttribute('style', 'display: block');
                renderPlaylist(g.id)
            }
            let img = createElement('img', 'card-img-top');
            img.setAttribute('src', g.icons[0].url);
            let cardText = createElement('div', 'card-text');
            let p = createElement('p', 'h6 normal mt-2 ml-2')
            p.innerText = g.name
            cardText.append(p)
            card.append(img, cardText);
            col.append(card);
            document.getElementById('rowBrowse' + browseCount).append(col)
        });
    })
}

const renderTracks = async (p, mode, songs=[]) => {
    document.getElementById('playlists').setAttribute('style', 'display: none');
    document.getElementById('tracksDiv').setAttribute('style', 'display: block');

    if (mode != 'fromAsync') {
        document.getElementById('homeBlock').setAttribute('style', 'display: none');
        document.getElementById('browseBlock').setAttribute('style', 'display: none');
        document.getElementById('titleRow').innerHTML = '';
        document.getElementById('tracks').innerHTML = '';
        let col = createElement('div', 'col-sm-3 mt-2');
        let card = createElement('div', 'card bg-dark');
        let img = createElement('img', 'card-img-top');
        img.setAttribute('src', 'https://icons-for-free.com/iconfiles/png/512/apple+display+itunes+music+service+store+icon-1320192795526056376.png');
        card.append(img);
        col.append(card);
        let col2 = createElement('div', 'col-sm-9 mt-5');
        let para1 = createElement('p', 'h5 text-left text-white');
        para1.innerText = 'Made by ' + user.name;
        let para2 = createElement('p', 'h1 text-left text-white');
        para2.innerText = p.playlistName;
        let para3 = createElement('p', 'h6 text-left normal');
        para3.innerText = 'Made by '+user.name+'. ' + songs.length + ' songs'
        col2.append(para1, para2, para3);
        document.getElementById('titleRow').append(col, col2);
        let table = createElement('table', 'table table-dark');
        let thead = createElement('thead');
        let tr1 = createElement('tr');
        let th1 = createTD('Title');
        let th2 = createTD('Artist');
        let th3 = createTD('');
        let th4 = createTD('Action');
        let th5 = createTD('Action')
        tr1.append(th3, th1, th2, th4, th5);
        thead.append(tr1);
        let tbody = createElement('tbody');
            if (songs.length) {
                for (let i in songs) {
                    let tr2 = createElement('tr');
                    let td1 = createTD(JSON.parse(songs[i].song).track.album.name);
                    let td2 = createTD(JSON.parse(songs[i].song).track.artists.reduce((a, b) => {
                        return a + b.name + ' '
                    }, '').trim())
                    let td5 = createTD('');
                    let like = createElement('i', 'fas fa-thumbs-up likeTag cursor')
                    td5.append(like);
                    let td3 = createTD('');
                    td3.onclick = () => {
                        window.open(JSON.parse(songs[i].song).track.external_urls.spotify)
                    }
                    let td6 = createTD('');
                    let deleteTag =  createElement('i', 'fas fa-trash-alt cursor');
                    deleteTag.onclick = () => {
                        console.log(songs[i])
                        songRef.child(songs[i].id).remove();
                        songRef.orderByKey().on('value', snap=>{
                            let songsObj = snap.val();
                            let songs = new Set();
                            for(let j in songsObj){
                                if(songsObj[j].user === userId && songsObj[j].playlist === i.id){
                                    songs.add(JSON.stringify(songsObj[j]))
                                }
                            }
                            renderTracks(p, '', Array.from(songs).map(song=>JSON.parse(song)))
                        })

                    }
                    td6.append(deleteTag);
                    let iTag = createElement('i', 'fas fa-play-circle cursor')
                    td3.append(iTag)
                    tr2.append(td3, td1, td2, td5, td6);
                    tbody.append(tr2);
                }
        }
        table.append(thead, tbody);
        document.getElementById('tracks').append(table);

    } else {
        const result = await fetch(`https://api.spotify.com/v1/playlists/${p.id}/tracks`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        const data = await result.json();
        document.getElementById('titleRow').innerHTML = ''
        document.getElementById('tracks').innerHTML = ''
        let col = createElement('div', 'col-sm-3 mt-2');
        let card = createElement('div', 'card bg-dark');
        let img = createElement('img', 'card-img-top');
        img.setAttribute('src', p.images[0].url);
        card.append(img);
        col.append(card);
        let col2 = createElement('div', 'col-sm-9 mt-5');
        let para1 = createElement('p', 'h5 text-left text-white');
        para1.innerText = 'Made for ' + user.name;
        let para2 = createElement('p', 'h1 text-left text-white');
        para2.innerText = p.name;
        let para3 = createElement('p', 'h6 text-left normal');
        para3.innerText = 'Made by Spotify. ' + p.tracks.total + ' songs'
        col2.append(para1, para2, para3);
        document.getElementById('titleRow').append(col, col2);
        let table = createElement('table', 'table table-dark');
        let thead = createElement('thead');
        let tr1 = createElement('tr');
        let th = createTD('');
        let th1 = createTD('Title');
        let th2 = createTD('Artist');
        let th3 = createTD('Add to PlayList');
        let th4 = createTD('Action')
        tr1.append(th, th1, th2, th3, th4);
        thead.append(tr1);
        let tbody = createElement('tbody');
        for (let i in data.items) {
            let tr2 = createElement('tr');
            let td1 = createTD(data.items[i].track.album.name);
            let td2 = createTD(data.items[i].track.artists.reduce((a, b) => {
                return a + b.name + ' '
            }, '').trim())
            let td4 = createTD('+', 'cursor');
            let td5 = createTD('');
            let like = createElement('i', 'fas fa-thumbs-up likeTag cursor');
            like.onclick = () => {
                console.log('hi')
                like.classList.add('active');
            }
            td5.append(like);
            let td3 = createTD('');
            td3.onclick = () => {
                window.open(data.items[i].track.external_urls.spotify)
            }
            td4.onclick = () => {
                document.getElementById("playlistbutton").click();
                document.getElementById('song').value = JSON.stringify(data.items[i]);
            }

            let iTag = createElement('i', 'fas fa-play-circle cursor')
            td3.append(iTag)

            tr2.append(td3, td1, td2, td4, td5);
            tbody.append(tr2);
        }
        table.append(thead, tbody);
        document.getElementById('tracks').append(table);
    }
}
const appendPlayLists = () => {
    playlistRef.orderByKey().on('value', snapshot=>{
        let playlistObj = snapshot.val();
        let plist = [];
        for(let i in playlistObj) {
            if(playlistObj[i].user === userId){
                playlistObj[i]['id'] = i
                plist.push(playlistObj[i]);
            }
        }
        if(plist.length){
            document.getElementById('playlistForm2').style.display = 'block'; 
            document.getElementById('playModal').style.display = 'none';
            plist.forEach(i=>{
                let li = createElement('li', 'mr-auto mb-3 big', i.playlistName);
                li.innerText = i.playlistName
                li.onclick = () => {
                    toggle(i.playlistName);
                    songRef.orderByKey().on('value', snap=>{
                        let songsObj = snap.val();
                        let songs = new Set();
                        for(let j in songsObj){
                            if(songsObj[j].user === userId && songsObj[j].playlist === i.id){
                                songs.add(JSON.stringify(songsObj[j]))
                            }
                        }
                        renderTracks(i, '', Array.from(songs).map(song=>JSON.parse(song)))
                    })
                }
                document.getElementById('playUL').append(li);
                document.getElementById('playlist').options.add(new Option(i.playlistName, i.id));  
            });
        }
        
    })
}

// end of functions

if (token) {
    document.getElementById('userName').innerText = 'Made for ' + user.name
    getGenres(token);
    appendPlayLists();
    //getSongs();
    document.getElementById('playListForm').onsubmit = (e) => {
        const playlistId = playlistRef.push().key;
        playlistRef.child(playlistId).set({
            user : userId,
            playlistName :  document.getElementById('playlistName').value,
            description :  document.getElementById('description').value,
        })
    }
    document.getElementById('plForm').onsubmit = (e) => {
        let pl = document.getElementById('playlist').value;
        let song =  document.getElementById('song').value;
        const songId = songRef.push().key;
        songRef.child(songId).set({
            id : songId,
            user : userId,
            playlist : pl,
            song : song
        })
        console.log(pl,song);
    }
} else {
    alert('An error occured Please login again');
    window.open('index.html', '_self');
}

