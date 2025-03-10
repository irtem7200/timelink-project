    // Not ekranı 
    let activeUser = null;
    activeUser = localStorage.getItem('activeUser')
    activeUser = JSON.parse(activeUser);

    let selectedUserId = null;
    let noteList = []
    let users = [];

    (function () {
        getAgesArrow([])
    })();



    //show sınıfı ekleyip çıkarma

    function toggleAgesArrow() {
        const textarea = document.querySelector(".text")
        if (event.target.classList.contains('show')) {
            event.target.classList.remove('show')

        } else {
            document.getElementsByClassName('age-btn show').length && document.getElementsByClassName('age-btn show')[0].classList.remove('show')
            event.target.classList.add('show')
        }
    }

    //Verilen yaş için notların olup olmadığını kontrol eder.
    function checkNotes(age) {
        const activetexts = window.activetexts || []
        return activetexts.some(note => note.age === parseInt(age));

    }


    //Yaş tıklama işlemine göre not detaylarını gösterir veya gizler.

    function toggleNoteDetail(event) {
        let textarea = document.getElementById('notTextArea')
        const wrapper = document.getElementById("activeNote")
        const clickedAge = parseInt(event.target.id);
        let focused = document.getElementsByClassName('age-note focus')[0]
        focused && focused.classList.remove('focus')
        resetArrow()
        if (activeUser || selectedUserId) {
            selectedUserId = !selectedUserId ? activeUser.id : selectedUserId
            if (activeUser && selectedUserId == activeUser.id) {
                if (event.target.classList.contains('active')) {
                    let activeNote = window.activetexts && window.activetexts.filter(note => note.age == clickedAge)
                    wrapper.innerHTML = activeNote.length ? activeNote[0].note : '';
                    wrapper.classList.add("active");
                } else {
                    if (clickedAge > parseInt(activeUser.age))
                        document.getElementById('noteInfo').innerHTML = 'Şuanki yaşınızdan büyük bir yaş seçemezsiniz!'
                    else {
                        event.target.classList.add('focus')
                        textarea.classList.add('active')
                    }
                }
            } else {
                if (event.target.classList.contains('active')) {

                    if (wrapper.classList.contains('active') && clickedAge == wrapper.getAttribute('data-id')) {
                        wrapper.classList.remove("active");
                        wrapper.innerHTML = '';
                        wrapper.removeAttribute('data-id');
                        return;
                    }

                    if (checkNotes(clickedAge)) {
                        console.log(clickedAge)

                        if (wrapper.classList.contains('active') && clickedAge == wrapper.getAttribute('data-id')) {
                            wrapper.classList.remove("active");
                            wrapper.innerHTML = '';
                            wrapper.attributes('data-id', clickedAge)
                        } else {
                            wrapper.classList.add("active");
                            let activeNote = window.activetexts && window.activetexts.filter(note => note.age == clickedAge)
                            wrapper.innerHTML = activeNote.length ? activeNote[0].note : '';
                        }
                    } else {
                        wrapper.classList.remove("active");
                        wrapper.innerHTML = "";
                    }
                }
            }
        } else {
            console.log('go to signup')
            document.getElementById('pageInfo').innerHTML = '<a href="/login.html">Üyelik</a> sayfasında üye olarak hemen not paylaşmaya başlayabilirsiniz.'
        }
    }

    //Kullanıcının girdiği notu kaydeder ve yerel depolamaya (localStorage) ekler
    function saveNote() {
        let noteValue = document.getElementById('notTextArea').value
        let age = document.getElementsByClassName('age-note focus')[0]
        let userId = activeUser.id

        let lastId = 0;
        noteList.map(note => {
            if (lastId < note.id)
                lastId = note.id
        })
        let id = lastId + 1

        let note = {
            id,
            userId,
            age: parseInt(age.attributes.id.value),
            note: noteValue

        }

        noteList.push(note)
        localStorage.setItem('noteList', JSON.stringify(noteList))
        document.getElementById('noteInfo').innerHTML = 'Notunuz başarı ile eklendi.'
        setTimeout(function () {
            showUsers(activeUser.section)
            userNotes(userId)
        }, 1000)
    }


    // Yaş okunu oluşturur ve her yaşa ait notları filtreleyip görüntüler. Yaş butonlarına tıklanabilirlik ekler.


    function getAgesArrow(notes) {
        let ageBlock = document.getElementById('ageBlock')
        document.getElementById('pageInfo').innerHTML = ''
        const blockCount = 9
        const ageCount = 10
        let myHTML = ''


        for (var i = 1; i < blockCount; i++) {
            let activeCls = notes && notes.some(note => Math.floor(note.age / 10) === i) ? 'active' : ''
            myHTML += '<div class="age-btn ' + activeCls + '">' + i * 10 + '..</div><div class="age-note-wrapper">';

            for (var j = 0; j < ageCount; j++) {
                let currentAge = (10 * i) + j

                let filteredNotes = notes && notes.filter(note => note.age === currentAge)

                let activeAge = filteredNotes.length > 0 ? 'active' : ''
                myHTML += '<div class="age-note ' + activeAge + '" id="' + currentAge + '">' + currentAge + '</div>';
            }
            myHTML += '</div>'
        }

        ageBlock.innerHTML = myHTML + '<div class="triangle"></div>'
        let btns = document.getElementsByClassName("age-btn");

        for (var i = 0; i < btns.length; i++) {
            btns[i].onclick = toggleAgesArrow
        }

        let ageNoteBtn = document.getElementsByClassName("age-note");
        for (var i = 0; i < ageNoteBtn.length; i++) {
            ageNoteBtn[i].onclick = toggleNoteDetail
        }
    }


    //Seçilen kullanıcının notlarını filtreler ve yaş oklarını yeniden oluşturur

    function userNotes(userId) {
        selectedUserId = userId
        const usernot = noteList.filter(note => note.userId === userId);
        console.log(usernot, selectedUserId)
        window.activetexts = usernot
        getAgesArrow(usernot)
        resetArrow()
    };



    //Yaş oklarını sıfırlayarak, tıklanan yaşın ok işaretini kaldırır
    function resetArrow() {
        let textarea = document.getElementById('notTextArea')
        const wrapper = document.getElementById("activeNote")
        wrapper.classList.remove("active");
        textarea.classList.remove('active');
        wrapper.innerHTML = "";
        textarea.value = "";
        document.getElementById('noteInfo').innerHTML = ''
        document.getElementById('pageInfo').innerHTML = ''
    }



    fetch('./notes.json')
        .then((response) => response.json())
        .then(data => {
            noteList = data.list;
            let newNotes = localStorage.getItem('noteList')
            newNotes = JSON.parse(newNotes)
            noteList = newNotes && newNotes.length > noteList.length ? newNotes : noteList
        });


    fetch("./users.json")
        .then(response => response.json())
        .then(datas => {
            users = datas.users;
            let newUsers = localStorage.getItem('users')
            newUsers = JSON.parse(newUsers)
            users = newUsers && newUsers.length > users.length ? newUsers : users
        });



    //Kullanıcıları verilen bölüme göre filtreler ve sonucu görüntüler
    function showUsers(section) {
        resetArrow()
        const filterUser = users.filter(user => user.section === section);
        const result = document.getElementById("results");
            result.innerHTML = filterUser.map(user =>
                ` <div class="user" onclick="userNotes(${user.id})"> ${user.name} yaş: ${user.age} ${user.job} </div> `
            ).join("");
    }


    //Kullanıcı giriş durumu kontrol eder ve aktif kullanıcının adını gösterir.
    function checkStatus() {
        if (activeUser) {
            document.getElementById('userTitle').innerHTML = activeUser.name
            document.getElementById('userIcon').classList.add('hide')
        }
    }


    //Kullanıcı oturum açmışsa çıkış yapar, yoksa giriş sayfasına yönlendirir

    function toggleAction() {
        if (activeUser) {
            localStorage.removeItem('activeUser')
            document.getElementById('userTitle').innerHTML = ''
            document.getElementById('userIcon').classList.remove('hide')
            setTimeout(function () {
                window.location.reload()
            }, 200)
        } else {
            window.location = 'login.html'
        }
    }
