const token = localStorage.getItem('token');
let cnt = localStorage.getItem('pcount');
const user = JSON.parse(localStorage.getItem('user'))

let thisSong = {};
let thisPlaylist = {}
document.getElementById('username').innerText = user.name
document.getElementById('userName').innerText = 'Made for '+user.name
const createElement = (element, className = '', id) => {
    let ele = document.createElement(element);
    ele.setAttribute('class', className);
    ele.id = id;
    return ele
}

const createTD = (text) => {
    let td = createElement('td', 'text-center');
    td.innerText = text;
    return td;
}

if (cnt != 0) {
    for (let i = 1; i <= cnt; i++) {
        let li = createElement('li', 'mr-auto mb-3');
        let obj = JSON.parse(localStorage.getItem('playlist' + i));
        if (obj !== undefined) {
            console.log(obj.n)
            li.innerText = obj.n
            document.getElementById('playUL').append(li);
            li.onclick = () => {
                renderTracks(obj, 'playlist' + i);
            }
            let row = createElement('div', 'row')
            let p = createElement('p');
            let a = createElement('a');
            a.setAttribute('style', 'color: white');
            a.onclick = () => {
                addSong(obj)
            }
            a.innerText = obj.n
            p.append(a);
            row.append(p)
            document.getElementById('playModalList').append(row)
        }

    }
}

const renderPlaylist = async (genreId) => {
    const limit = 10;

    const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token }
    });

    const data = await result.json();
    let playlists = data.playlists.items;
    console.log(playlists)
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

const renderTracks = async (p, mode) => {
    document.getElementById('playlists').setAttribute('style', 'display: none');
    document.getElementById('tracksDiv').setAttribute('style', 'display: block');

    if (mode != 'fromAsync') {
        console.log('hi');
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
        para1.innerText = 'Made by '+user.name;
        col2.append(para1);
        document.getElementById('titleRow').append(col, col2);
        let table = createElement('table', 'table table-dark');
        let thead = createElement('thead');
        let tr1 = createElement('tr');
        let th1 = createTD('Title');
        let th2 = createTD('Artist');
        let th3 = createTD('')
        tr1.append(th3, th1, th2);
        thead.append(tr1);
        let tbody = createElement('tbody');
        thisPlaylist = JSON.parse(localStorage.getItem(mode));
        if (thisPlaylist) {
            if (thisPlaylist.songs) {
                for (let i in thisPlaylist.songs) {
                    console.log(thisPlaylist.songs[i])
                    let tr2 = createElement('tr');
                    let td1 = createTD(thisPlaylist.songs[i].track.album.name);
                    let td2 = createTD(thisPlaylist.songs[i].track.artists.reduce((a, b) => {
                        return a + b.name + ' '
                    }, '').trim())
                    let td4 = createTD('+');
                    let td3 = createTD('');
                    td3.onclick = () => {
                        window.open(thisPlaylist.songs[i].track.external_urls.spotify)
                    }

                    let iTag = createElement('i', 'fas fa-play-circle')
                    td3.append(iTag)

                    tr2.append(td3, td1, td2);
                    tbody.append(tr2);
                }
            }

        }
        table.append(thead, tbody);
        document.getElementById('tracks').append(table);

    } else {
        const limit = 10;

        const result = await fetch(`https://api.spotify.com/v1/playlists/${p.id}/tracks`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        const data = await result.json();
        console.log(data.items);
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
        para1.innerText = 'Made for Pavan';
        let para2 = createElement('p', 'h1 text-left text-white');
        para2.innerText = p.name;
        let para3 = createElement('p', 'h6 text-left normal');
        para3.innerText = 'Made for '+user.name+' by Spotify. ' + p.tracks.total + ' songs'
        col2.append(para1, para2, para3);
        document.getElementById('titleRow').append(col, col2);
        let table = createElement('table', 'table table-dark');
        let thead = createElement('thead');
        let tr1 = createElement('tr');
        let th1 = createTD('Title');
        let th2 = createTD('Artist')
        let th3 = createTD('Add to PlayList')
        tr1.append(th1, th2, th3);
        thead.append(tr1);
        let tbody = createElement('tbody');
        for (let i in data.items) {
            let tr2 = createElement('tr');
            let td1 = createTD(data.items[i].track.album.name);
            let td2 = createTD(data.items[i].track.artists.reduce((a, b) => {
                return a + b.name + ' '
            }, '').trim())
            let td4 = createTD('+');
            let td3 = createTD('');
            td3.onclick = () => {
                window.open(data.items[i].track.external_urls.spotify)
            }
            td4.onclick = () => {
                console.log('hi')
                document.getElementById("playlistbutton").click();
                thisSong = data.items[i]
            }

            let iTag = createElement('i', 'fas fa-play-circle')
            td3.append(iTag)

            tr2.append(td3, td1, td2, td4);
            tbody.append(tr2);
        }
        table.append(thead, tbody);
        document.getElementById('tracks').append(table);
    }
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
    console.log(browsePacks)
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
    })
    let browseCount = 0
    browsePacks.forEach((p) => {
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
            document.getElementById('rowBrowse' + count).append(col)
        });
        browseCount++
    })
}
getGenres(token);


function triggerButton() {
    document.getElementById("modalButton").click()
}

function toggle(val) {
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
}

let pcount = 0;
document.getElementById('playListForm').onsubmit = (e) => {

    if (cnt == 4) {
        alert('maximum of 4 playlists only')
    } else {
        let name = document.getElementById('playListName').value;
        let description = document.getElementById('description').value;
        let li = createElement('li', 'mr-auto mb-3');
        li.innerText = name;
        pcount++;
        let playlist1 = {
            id: pcount,
            n: name,
            des: description,
            songs: []
        }
        localStorage.setItem('playlist' + pcount, JSON.stringify(playlist1))
        localStorage.setItem('pcount', pcount);
        document.getElementById('playUL').append(li);
        e.preventDefault();
    }

}

function addSong(playlistId) {
    thisPlaylist = playlistId
    thisPlaylist.songs.push(thisSong);
    localStorage.setItem('playlist' + playlistId.id, JSON.stringify(thisPlaylist));
    alert('song added successfully');
    document.getElementsByClassName('close').click();
}