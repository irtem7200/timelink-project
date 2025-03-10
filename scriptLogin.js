// Not ekranı 
let users = [];

(function () {
    function showUsers(section) {
        const filterUser = users.filter(user => user.section === section);
        const result = document.getElementById("results");
        result.innerHTML = filterUser.map(user =>
            ` <div class="user" onclick="userNotes(${user.id})"> ${user.name} yaş: ${user.age} ${user.job} </div> `
        ).join("");
    }

    fetch("./users.json")
        .then(response => response.json())
        .then(datas => {    
            users = datas.users;
            let newUsers = localStorage.getItem('users')
            newUsers = JSON.parse(newUsers)
            users = newUsers && newUsers.length > users.length ? newUsers : users
            localStorage.setItem('users', JSON.stringify(users))
        });

})();


function showSignUp() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';

}

function showLogin() {
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}

function signUp() {
    let nameSignup = document.getElementById('nameSignup').value
    let ageSignup = document.getElementById('ageSignup').value
    let jobSignup = document.getElementById('jobSignup').value
    let sectionSignup = document.getElementById('sectionSignup').value
    let passwordSignup = document.getElementById('passwordSignup').value
    let emailSignup = document.getElementById('emailSignup').value

    let signupError = document.getElementById('signupError')
    let signupSuccess = document.getElementById('signupSuccess')
    signupError.innerHTML = ''
    signupSuccess.innerHTML = ''

    if (nameSignup.length < 5 || ageSignup.length < 2 || jobSignup.length < 3 || !sectionSignup.length || passwordSignup.length != 6 || emailSignup.length < 9 || !emailSignup.includes('@')) {
        signupError.innerHTML = 'Eksik veya hatalı bilgi girdiniz, lütfen kontrol edin.'
        return
    }


    let notUnique = users.find(user => {
        return user.email == emailSignup
    })
    if (notUnique) {
        signupError.innerHTML = 'Kayıtlı bir mail adresi ile üye olmaya çalıştınız. Şifrenizi unuttuysanız sifremiunuttum@bayram.irt mail ile yazabilirsiniz.'
    } else {
        let lastId = 0;
        users.map(user => {
            if (lastId < user.id)
                lastId = user.id
        })
        let newUser = {}
        newUser.name = nameSignup
        newUser.age = parseInt(ageSignup)
        newUser.section = sectionSignup
        newUser.job = jobSignup
        newUser.email = emailSignup
        newUser.password = passwordSignup
        newUser.id = lastId + 1
        users.push(newUser)
        localStorage.setItem('users', JSON.stringify(users))
        formSuccess.innerHTML = 'Başarıyla üye olundu, anasayfaya yönlendiriliyorsunuz..'
        localStorage.setItem('activeUser', JSON.stringify(newUser))
        setTimeout(function () {
            window.location = '/index.html'
        }, 1000)
    }
}
function login() {
    let emailError = document.getElementById('emailError')
    let passwordError = document.getElementById('passwordError')
    let formSuccess = document.getElementById('formSuccess')
    emailError.innerHTML = ''
    passwordError.innerHTML = ''
    formSuccess.innerHTML = ''

    let email = document.getElementById('mail').value
    let password = document.getElementById('password').value

    if (email.length < 9 || !email.includes('@')) {
        // show error
        emailError.innerHTML = 'Geçerli bir email adresi giriniz'
        return
    }

    if (password.length != 6) {
        // show error
        passwordError.innerHTML = 'Şifreniz 6 karakter olmalıdır'
        return
    }

    if (email.length && password.length) {
        let activeUser = users.find(user => {
            return user.email == email
        })
        if (activeUser && activeUser.password == password) {
            //success
            formSuccess.innerHTML = 'Başarıyla giriş yapıldı, anasayfaya yönlendiriliyorsunuz..'
            localStorage.setItem('activeUser', JSON.stringify(activeUser))
            setTimeout(function () {
                window.location = '/index.html'
            }, 1000)
        } else {
            passwordError.innerHTML = 'Email veya şifre hatalı girdiniz'
            return
        }
    }
}

