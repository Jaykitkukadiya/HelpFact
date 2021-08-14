var shortnoti_open = {
    0: 0,
    1: 0,
    2: 0
}


function short_notification(texts = "notification", timex = 5000, action = "") {

    if (document.getElementById("notificationbx").style.display == "block") {
        clearTimeout(shortnoti_open[1]);
        clearTimeout(shortnoti_open[2]);
        document.getElementById("notif_name").style.bottom = "-500px";
        shortnoti_open[0] = setTimeout(() => {
            document.getElementById("notif_name").innerHTML = texts;
            document.getElementById("notif_name").style.bottom = "10px";
        }, 150);
        shortnoti_open[1] = setTimeout(() => {
            document.getElementById("notif_name").style.bottom = "-500px";
        }, timex + 100);
        shortnoti_open[2] = setTimeout(() => {
            document.getElementById("notificationbx").style.display = "none";
            eval(action);
        }, timex + 200);
    } else {
        document.getElementById("notificationbx").style.display = "block";
        shortnoti_open[0] = setTimeout(() => {
            document.getElementById("notif_name").innerHTML = texts;
            document.getElementById("notif_name").style.bottom = "10px";
        }, 100);
        shortnoti_open[1] = setTimeout(() => {
            document.getElementById("notif_name").style.bottom = "-500px";
        }, timex + 100);
        shortnoti_open[2] = setTimeout(() => {
            document.getElementById("notificationbx").style.display = "none";
            eval(action);
        }, timex + 200);
    }
}



window.addEventListener('load' , function() {
    document.getElementById("more_menu").addEventListener( 'click' ,() => {
        document.getElementById("more_menu_container").classList.remove("hidd");
        document.body.classList.add("scrolllock");
    });
    
    document.getElementById("more_menu_container").addEventListener("click", (e) => {
        if (e.target.id == "more_menu_container") {
            document.getElementById("more_menu_container").classList.add("hidd"); 
            document.body.classList.remove("scrolllock");
        }
    })
    try
    {
        document.getElementById("logout_request_btn").onclick = () => {
            document.getElementById("loading_rounder").classList.remove("hidd");
            fetch('/api/logout/', {
                method: 'POST',
                headers: { 'X-CSRFToken': getCookie('csrftoken') },
            }).then((response) => response.json())
                .then((result) => {
                    if (result.code == 200) {
                        document.getElementById("loading_rounder").classList.add("hidd");
                        location.href = "/login/";
                    }
                    else {
                        document.getElementById("loading_rounder").classList.add("hidd");
                        short_notification(result.detail, 5000);
                    }
                });
        }
    }
    catch
    {
        console.log("logout has some problem");
    }
});

// var short_noti_ids = [];
// var short_noti_counter = 0;

// function notitimer(id, texts, bottom_pad, timex, action) {
//     document.getElementById(`short_noti_texts_${id}`).innerHTML = texts;
//     setTimeout(() => {
//         document.getElementById(`short_noti_texts_${id}`).style.bottom = `${bottom_pad}px`;
//     }, 100);
//     setTimeout(() => {
//         document.getElementById(`short_noti_texts_${id}`).style.bottom = "-500px";

//         let array_pointer = short_noti_ids.indexOf(id);
//         short_noti_ids.splice(array_pointer, 1);
//         if (short_noti_ids.length == 0) {
//             short_noti_counter = 0;
//         }

//     }, timex + 100);
//     setTimeout(() => {
//         document.getElementById(`short_noti_texts_${id}`).remove();
//         eval(action);
//     }, timex + 200);
// }

// function short_notification(texts = "notification", timex = 5000, action = "") {
//     if (short_noti_ids.length == 0) {
//         bottom_pad = 10;
//     } else {
//         bottom_pad = (short_noti_ids.length * (50)) + 10;
//     }
//     id = short_noti_counter + 1;
//     var div = document.createElement('div');
//     div.id = `short_noti_texts_${id}`;
//     div.innerHTML = `...`;
//     div.className = 'notification-box';
//     document.getElementById("noti_container").appendChild(div);

//     short_noti_ids.push(id);
//     notitimer(id, texts, bottom_pad, timex, action);
//     short_noti_counter++;
// }


function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
