const userId = '8f4d59f3fa4c411e87d64a30a9df3a46';
const userSecret = 'ef9b12c1f49549939333056a8ee91d3e';
const database = firebase.database();
const signUpForm = document.getElementById('signUpForm');
const loginForm = document.getElementById('loginForm');
const userRef = database.ref('users');

let user = {
    name: '',
    email: '',
    password: ''
}


signUpForm.onsubmit = function (e) {
    let formData = signUpForm.elements;
    for (let i in user) {
        user[i] = formData[i].value;
    }
    const id = userRef.push().key;
    console.log(user);
    userRef.orderByKey().on('value', async snapshot=>{
        let users = snapshot.val();
        for(let i in users){
            if(user.email === users[i].email){
                document.getElementById('signUpError').setAttribute('style', 'display : block');
                setTimeout( function () {
                    document.getElementById('signUpError').setAttribute('style', 'display : none');
                }, 1000)
                return;
            }
        }
        userRef.child(id).set({
            name: user.name,
            password: user.password,
            email: user.email
        });
        let token = await getTokenFromUrl(userId, userSecret);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('userId', id);
        window.open('menu.html', '_self');
    })
    e.preventDefault();
}

loginForm.onsubmit = function (e) {
    let email = document.getElementById('emailLogin').value;
    let password = document.getElementById('passwordLogin').value;
    userRef.orderByKey().on('value', async snapshot=>{
        let users = snapshot.val();
        for(let i in users){
            if(email === users[i].email && password === users[i].password){
                console.log(JSON.stringify(users[i]));
                let token = await getTokenFromUrl(userId, userSecret);
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(users[i]))
                localStorage.setItem('userId', i);
                window.open('menu.html', '_self');
                return;
            }
        }
        document.getElementById('loginError').setAttribute('style', 'display : block');
        setTimeout( function () {
            document.getElementById('loginError').setAttribute('style', 'display : none');
        }, 1000)
    });
    
    e.preventDefault();
}



const getTokenFromUrl = async (userId, userSecret) => {
    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(userId + ':' + userSecret)
        },
        body: 'grant_type=client_credentials'
    });

    const data = await result.json();
    let token = data.access_token;
    return token;
};




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
