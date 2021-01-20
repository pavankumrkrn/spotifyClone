const userId = '8f4d59f3fa4c411e87d64a30a9df3a46';
const userSecret = 'ef9b12c1f49549939333056a8ee91d3e';

let user = {
    id: '',
    name : '',
    password : '',
    email : ''
}

const login = () => {

}
let count = 1;
if(localStorage.getItem('userCount')) {
    count++;
}
const signUp = () => {
    let name = document.getElementById('name').value;
    let password = document.getElementById('password').value;
    let email = document.getElementById('email').value;
    localStorage.setItem('userCount', count);
    user.id = count,
    user.name = name,
    user.password = password,
    user.email = email,
    localStorage.setItem('user', JSON.stringify(user));
    window.open("menu.html", "_self")

}

const getTokenFromUrl = async (userId, userSecret) => {
    const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded', 
                'Authorization' : 'Basic ' + btoa(userId + ':' + userSecret)
            },
            body: 'grant_type=client_credentials'
        });

    const data = await result.json();
    let token =data.access_token;
    localStorage.setItem('token', token);
};

getTokenFromUrl(userId, userSecret)


function hideMainCard(id) {
    document.getElementById('mainCard').setAttribute('style', 'display: none');
    if (id == 'signUp')
        document.getElementById('signUpCard').setAttribute('style', 'display: block');
    else
        document.getElementById('loginCard').setAttribute('style', 'display: block');
}

function hideLoginCard() {
    document.getElementById('loginCard').setAttribute('style', 'display: none');
    document.getElementById('signUpCard').setAttribute('style', 'display: block');
}

function hideSignUpCard(val) {
    document.getElementById('signUpCard').setAttribute('style', 'display: none');
    if (val == 'back')
        document.getElementById('mainCard').setAttribute('style', 'display: block');
    else
        document.getElementById('loginCard').setAttribute('style', 'display: block');
}