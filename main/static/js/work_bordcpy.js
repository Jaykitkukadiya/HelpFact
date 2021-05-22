document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        short_notification("Page Loaded. Wait for a while we connect.", 10000)
    }
};


var open_task_detail = {
    id: [],
    selected_id: "",
    selected_deadline_intervals: [],
    selected_deadline_timestemp: 0,
    selected_map_letlong: "",
};
var completed_task_detail = {
    id: [],
    selected_id: "",
    selected_deadline_intervals: [],
    selected_deadline_timestemp: 0,
    selected_map_letlong: "",
};
var panding_task_detail = {
    id: [],
    selected_id: "",
    selected_interval: "",
    selected_deadline_intervals: [],
    selected_deadline_timestemp: 0,
    selected_map_letlong: "",
};


function get_completed_task_details() {

    favi.href = "/static/icon/favicon_offline.svg";

    fetch('/api/task/complete/getmoredetails/', {
        method: 'POST',
        body: JSON.stringify({
            'task_id': Number(completed_task_detail["selected_id"])
        })
    }).then((response) => response.json())
        .then((result) => {
            console.log('Success:', result);
            if (result.code == 200) {

                console.log(result.data)

                load_fixed_map(JSON.parse(result.data.gmaplink), "completed_task_gmap_container")

                document.getElementById("completed_task_more_info_name").innerText = result.data.name;
                document.getElementById("completed_task_more_info_gender").innerText = result.data.gender;
                document.getElementById("completed_task_more_info_pincode").innerText = result.data.pincode;
                document.getElementById("completed_task_more_info_address").innerText = result.data.address;
                if(result.data.agent_payment_status == "success")
                {
                    document.getElementById("completed_task_more_info_agent_payment_status").src = `/static/icon/true_round.svg`;
                    document.getElementById("completed_payment_info").classList.remove("hidd");
                }
                else if(result.data.agent_payment_status == "panding")
                {
                    document.getElementById("completed_task_more_info_agent_payment_status").src = `/static/icon/panding_round.svg`;
                    document.getElementById("completed_payment_info").classList.remove("hidd");
                }
                else if(result.data.agent_payment_status == "fail")
                {
                    document.getElementById("completed_task_more_info_agent_payment_status").src = `/static/icon/false_round.svg`;
                    document.getElementById("completed_payment_info").classList.add("hidd");
                }
                document.getElementById("completed_task_more_info_accepted_time").innerText = result.data.accepted_time;
                document.getElementById("completed_task_more_info_completed_time").innerText = result.data.completed_time;
                
                document.getElementById("completed_task_more_info_user_name").innerText = result.data.user_name;
                document.getElementById("completed_task_more_info_user_mobile").innerText = result.data.user_mobile;
                document.getElementById("completed_task_more_info_user_gender").innerText = result.data.user_gender;

                document.getElementById("completed_task_more_info_user_profile_image").src = `/media/${result.data.user_image}`;
                document.getElementById("completed_task_more_info_user_profile_image_link").href = `/media/${result.data.user_image}`;
                
        
                document.getElementById("completed_task_more_info_image").src = `/media/${result.data.image}`;
                document.getElementById("completed_task_more_info_image_link").href = `/media/${result.data.image}`;
                short_notification("details fetched", 2000)
                
            } else if (result.code == 405) {
                short_notification(result.detail, 2000)
            }
        })
        // .catch((error) => {
        //     short_notification(error, 2000)
        // });
    favi.href = "/static/icon/fav.svg";

}


function completed_task_select_listener() {
    completed_task_detail['id'].forEach((id) => {
        document.getElementById(`workboard_completed_page_completed_task_${id}`).onclick = () => {
            completed_task_detail['id'].forEach((idx) => {
                document.getElementById(`workboard_completed_page_completed_task_${idx}`).style.backgroundColor = "transparent";
                document.getElementById(`workboard_completed_page_completed_task_${idx}`).style.border = "2px solid #1E75D9";
                document.getElementById(`workboard_completed_page_completed_task_${idx}`).innerText = "Select";
                document.getElementById(`workboard_completed_page_completed_task_${idx}`).style.color = "#1E75D9";
            });
            document.getElementById(`workboard_completed_page_completed_task_${id}`).style.backgroundColor = "#1E75D9";
            document.getElementById(`workboard_completed_page_completed_task_${id}`).style.color = "black";
            document.getElementById(`workboard_completed_page_completed_task_${id}`).style.border = "1px solid #1E75D9";
            document.getElementById("completed_page_more_detail_btn_container").classList.remove("hidd");
            completed_task_detail['selected_id'] = id;
            document.getElementById(`workboard_completed_page_completed_task_${id}`).innerText = "Selected";

        };
    });
}

function panding_card_more_details_listener() {
    Array.from(panding_task_detail['id']).forEach((panding_id) => {
        document.getElementById(`panding_card_${panding_id}`).onclick = () => {
            panding_task_detail['selected_id'] = String(panding_id);
            document.getElementById("page_loading_rounder").classList.remove("hidd");
            // console.log(panding_task_detail['selected_id']);
            // setTimeout(() => {
            //     document.getElementById("page_loading_rounder").classList.add("hidd");
            //     document.getElementById("panding_more_detail_popup").classList.remove("hidd");
            // }, 1000);
            fetch('/api/task/getmoredetails/', {
                method: 'POST',
                body: JSON.stringify({ 'panding_id': panding_id })
            })
                .then((response) => response.json())
                .then((result) => {
                    console.log('Success:', result);
                    if (result.code == 200) {
                        panding_task_detail['selected_interval'] = open_task_reverse_timer("panding_task_deadline", result.data.deadline);
                        document.getElementById('panding_task_user_profile_image_link').href = `/media/${result.data.user_image}`;
                        document.getElementById('panding_task_user_profile_image').src = `/media/${result.data.user_image}`;

                        document.getElementById('panding_task_profile_image_link').href = `/media/${result.data.image}`;
                        document.getElementById('panding_task_profile_image').src = `/media/${result.data.image}`;

                        document.getElementById('panding_task_user_name').innerText = `${result.data.user_name}`;
                        document.getElementById('panding_task_user_gender').innerText = `${result.data.user_xender}`;
                        document.getElementById('panding_task_user_mobile').innerText = `${result.data.user_mobile}`;

                        document.getElementById('panding_task_name').innerText = `${result.data.name}`;
                        document.getElementById('panding_task_gender').innerText = `${result.data.gender}`;
                        document.getElementById('panding_task_address').innerText = `${result.data.address}`;
                        document.getElementById('panding_task_pincode').innerText = `${result.data.pincode}`;
                        document.getElementById('panding_task_mobile').innerText = `${result.data.mobile_number}`;
                        document.getElementById('panding_task_accepted_time').innerText = `${result.data.accepted_time}`;
                        document.getElementById('panding_task_note').innerText = `${result.data.note}`;
                        document.getElementById('panding_task_document_link').href = `/media/${result.data.document}`;
                        document.getElementById('panding_task_proof_link').href = `/media/${result.data.proof}`;
                        // document.getElementById('panding_task_gmap_container').href = `https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=${JSON.parse(result.data.gmaplink).lat},${JSON.parse(result.data.gmaplink).lng}&output=embed`
                        load_fixed_map(JSON.parse(result.data.gmaplink), "panding_task_gmap_container");

                        document.getElementById("page_loading_rounder").classList.add("hidd");
                        document.getElementById("panding_more_detail_popup").classList.remove("hidd");
                    }
                    else if (result.code == 405) {
                        short_notification(result.detail, 5000);
                        document.getElementById("page_loading_rounder").classList.add("hidd");
                    }
                })
                .catch((error) => {
                    document.getElementById("page_loading_rounder").classList.add("hidd");
                    short_notification(error, 5000);
                });

        }
    });
}

function open_task_reverse_timer(dest_id, deadline) {
    console.log(deadline)
    // open_task_detail['selected_deadline_timestemp'] = Number(deadline);
    let deadlinetimestemp = (new Date(Number(deadline)) - Date.now()) / 1000;
    let interval_id = setInterval(function () { // execute code each second
        deadlinetimestemp--;
        let hours = Math.floor(deadlinetimestemp / (60 * 60)); // hours
        let minutes = Math.floor(deadlinetimestemp / 60) % 60; // minutes
        let seconds = Math.floor(deadlinetimestemp / 1) % 60; // seconds
        if (hours == 0 && minutes <= 30) {
            document.getElementById(dest_id).style.color = "red";
        }
        if (hours <= 0 && minutes <= 0 && seconds <= 0) {
            document.getElementById(dest_id).innerText = `Task crossing the deadline..`;
            clearInterval(interval_id);
        } else {
            document.getElementById(dest_id).innerText = `${hours}:${minutes}:${seconds} *(H:M:S) `;
        }
    }, 1000);
    return interval_id;

}

function open_task_accept_add_listener() {
    open_task_detail['id'].forEach((id) => {
        document.getElementById(`open_task_accept_${id}`).onclick = () => {
            open_task_detail['selected_id'] = id;
            document.getElementById("open_task_accept_live_location").placeholder = `you have to submit your live location for task id : ${open_task_detail['selected_id']}\n\n*submitting the fake location cause bad effect on your account*`;
            document.getElementById("accept_popup").classList.remove("hidd");
        }
    });
}




var favi = document.querySelector("link[rel~='icon']");

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

// this is for google map loading
const initMap = (divid, storeid, nameid, mylat = "") => {

    // divid : in which div we wants to add map
    // default credentials
    if (mylat == "") {
        var myLatlng = {
            lat: 22.2587,
            lng: 71.1924
        };
    } else {
        var myLatlng = JSON.parse(mylat);
    }

    const infowindow = new google.maps.InfoWindow();
    // const map = new google.maps.Map(document.getElementById("googlemap_container"), {
    const map = new google.maps.Map(document.getElementById(divid), {
        zoom: 7, //choose zoom lavel of google map
        center: myLatlng,
        fullscreenControl: false,
        mapTypeControl: true,
        streetViewControl: true,
    });

    var marker = "";

    map.addListener("click", (mapsMouseEvent) => {
        var userMarker = mapsMouseEvent.latLng;
        myLatlng = userMarker.toJSON();
        if (marker) {
            marker.setPosition(userMarker);
            // document.getElementById("show").src = `http://maps.google.com/maps?q=${myLatlng.lat},${myLatlng.lng}&z=16&output=embed`;
        } else {
            marker = new google.maps.Marker({
                position: userMarker,
                animation: google.maps.Animation.DROP
            });
            marker.setMap(map);
            // document.getElementById("show").src = `http://maps.google.com/maps?q=${myLatlng.lat},${myLatlng.lng}&z=16&output=embed`;
        }
        console.log(myLatlng);
        // if (document.getElementById('add_form_first_name').value != "") {
        if (document.getElementById(nameid).value != "") {
            infowindow.setContent(`<p style="min-width:100px; line-height:15px;text-align:center; padding:0px 12px 12px 0px;">${document.getElementById(nameid).value}</p>`);
            infowindow.open(map, marker);
        }
        document.getElementById(storeid).value = JSON.stringify(myLatlng);
        // document.getElementById('add_form_gmap').value = JSON.stringify(myLatlng);
        short_notification("Location is choosen you can close map.", 10000);
    });

    // document.getElementById("googlemap_container").lastElementChild.style.style.display = "none";
}


function load_fixed_map(myLatlng, divid) {
    const infowindow = new google.maps.InfoWindow();
    const map = new google.maps.Map(document.getElementById(divid), {
        zoom: 7, //choose zoom lavel of google map
        center: myLatlng,
        fullscreenControl: true,
        mapTypeControl: true,
        streetViewControl: true,
        draggable: true
    });


    marker = new google.maps.Marker({
        position: new google.maps.LatLng(myLatlng.lat, myLatlng.lng),
        animation: google.maps.Animation.DROP
    });
    marker.setMap(map);
}


var panding_pages = ['panding_task_info', 'panding_user_info', 'panding_location_info', 'panding_manage_task']
var completed_pages = ['completed', 'expired']
var completed_more_pages = ['completed_task_info', 'completed_location_info', 'completed_user_info',"completed_payment_info"]




var sidemenuids = ['sidemenu_profile', 'sidemenu_open_task', 'sidemenu_panding', 'sidemenu_completed']

var deshboard_pages = ['workboard_page_profile', 'workboard_page_open_task', 'workboard_page_panding', 'workboard_page_completed']

function clearmenu() {
    sidemenuids.forEach((allmenu) => {
        allmenuattr = document.getElementById(allmenu);
        document.getElementById(allmenu + "_icon").style.color = "#1E75D9";
        allmenuattr.classList.remove("deshboard-sidemenu-tab-selected");
    });
    deshboard_pages.forEach((allpage) => {
        document.getElementById(allpage).style.display = "none";
    });
}



window.onload = () => {

    window.onscroll = () => {
        if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
            document.getElementById("backtohome").style.visibility = "visible";
        } else {
            document.getElementById("backtohome").style.visibility = "hidden";
        }
    }
    document.getElementById("accept_popup").addEventListener("click", (e) => {
        if (e.target.id == "accept_popup") {
            e.target.classList.add("hidd");
        }
    })
    document.getElementById("panding_more_detail_popup").addEventListener("click", (e) => {
        if (e.target.id == "panding_more_detail_popup") {
            e.target.classList.add("hidd");
            clearInterval(panding_task_detail['selected_interval']);
        }
    })
    document.getElementById("completed_more_detail_popup").addEventListener("click", (e) => {
        if (e.target.id == "completed_more_detail_popup") {
            e.target.classList.add("hidd");
        }
    })

    if (open_task_detail['id'].length == 0) {
        document.getElementById('empty_message').classList.remove('hidd');
        document.getElementById('outer_open_task_container').classList.add('hidd');
    }
    else {
        document.getElementById('outer_open_task_container').classList.remove('hidd');
        document.getElementById('empty_message').classList.add('hidd');
    }

    if (panding_task_detail['id'].length == 0) {
        document.getElementById('panding_empty_message').classList.remove('hidd');
        document.getElementById('panding_card_container').classList.add('hidd');
    }
    else {
        document.getElementById('panding_card_container').classList.remove('hidd');
        document.getElementById('panding_empty_message').classList.add('hidd');
    }


    document.getElementById("open_task_accept_submit").onclick = () => {
        let agent_live_loc = document.getElementById("open_task_accept_live_location").value
        if (agent_live_loc != "") {
            document.getElementById("loading_rounder").classList.remove("hidd");
            fetch('/api/task/accept/', {
                method: 'POST',
                body: JSON.stringify({ 'panding_id': Number(open_task_detail['selected_id']), 'agent_location': String(agent_live_loc) })
            })
                .then((response) => response.json())
                .then((result) => {
                    console.log('Success:', result);
                    if (result.code == 200) {
                        document.getElementById('accept_popup').click();
                    }
                    else if (result.code == 405) {
                        document.getElementById("loading_rounder").classList.add("hidd");
                        short_notification(result.detail, 5000);
                    }
                })
                .catch((error) => {
                    document.getElementById("loading_rounder").classList.add("hidd");
                    short_notification(error, 5000);
                });
        }
        else {
            short_notification("please enter the live location", 5000);
        }
    }
    // side menu script

    // sidemenuids.forEach((menu) => {  //this is not working in loop so i created each tab listener saperetly

    side_profileattr = document.getElementById("sidemenu_profile");
    side_profileattr.addEventListener('click', () => {
        clearmenu();
        document.getElementById("sidemenu_profile_icon").style.color = "#175aa7";
        side_profileattr.classList.add("deshboard-sidemenu-tab-selected");
        document.getElementById('workboard_page_profile').style.display = "block";
    });
    side_addattr = document.getElementById("sidemenu_open_task");
    side_addattr.addEventListener('click', () => {
        clearmenu();
        document.getElementById("sidemenu_open_task_icon").style.color = "#175aa7";
        side_addattr.classList.add("deshboard-sidemenu-tab-selected");
        document.getElementById('workboard_page_open_task').style.display = "block";
    });
    side_pandingattr = document.getElementById("sidemenu_panding");
    side_pandingattr.addEventListener('click', () => {
        clearmenu();
        document.getElementById("sidemenu_panding_icon").style.color = "#175aa7";
        side_pandingattr.classList.add("deshboard-sidemenu-tab-selected");
        document.getElementById('workboard_page_panding').style.display = "flex";
    });

    side_completedattr = document.getElementById("sidemenu_completed");
    side_completedattr.addEventListener('click', () => {
        clearmenu();
        document.getElementById("sidemenu_completed_icon").style.color = "#175aa7";
        side_completedattr.classList.add("deshboard-sidemenu-tab-selected");
        document.getElementById('workboard_page_completed').style.display = "block";
    });

    //this is default click
    document.getElementById("sidemenu_profile").click();
    // }); // end of not working loop


    Array.from(panding_pages).forEach((pages) => {
        document.getElementById(pages).onclick = () => {
            Array.from(panding_pages).forEach((pagesx) => {
                document.getElementById(pagesx).style.borderColor = "transparent";
                document.getElementById(pagesx).style.color = "gray";
                document.getElementById(`${pagesx}_page`).classList.add('hidd');
            });
            document.getElementById(pages).style.borderColor = "black";
            document.getElementById(pages).style.color = "black";
            document.getElementById(`${pages}_page`).classList.remove('hidd');
        }
    });
    Array.from(completed_more_pages).forEach((pages) => {
        document.getElementById(pages).onclick = () => {
            Array.from(completed_more_pages).forEach((pagesx) => {
                document.getElementById(pagesx).style.borderColor = "transparent";
                document.getElementById(pagesx).style.color = "gray";
                document.getElementById(`${pagesx}_page`).classList.add('hidd');
            });
            document.getElementById(pages).style.borderColor = "black";
            document.getElementById(pages).style.color = "black";
            document.getElementById(`${pages}_page`).classList.remove('hidd');

        }
    });

    Array.from(completed_pages).forEach((pages) => {
        document.getElementById(`workboard_completed_page_part_selector_${pages}`).onclick = () => {
            Array.from(completed_pages).forEach((pagesx) => {
                document.getElementById(`workboard_completed_page_part_selector_${pagesx}`).classList.remove("workboard-page-part-selector-selected");
                document.getElementById(`workboard_completed_page_part_${pagesx}`).classList.add('hidd');
                document.getElementById(`completed_page_more_detail_btn_container`).classList.add('hidd');
            });
            completed_task_detail['id'].forEach((idx) => {
                document.getElementById(`workboard_completed_page_completed_task_${idx}`).style.backgroundColor = "transparent";
                document.getElementById(`workboard_completed_page_completed_task_${idx}`).style.border = "2px solid #1E75D9";
                document.getElementById(`workboard_completed_page_completed_task_${idx}`).innerText = "Select";
                document.getElementById(`workboard_completed_page_completed_task_${idx}`).style.color = "#1E75D9";
            });
            document.getElementById(`workboard_completed_page_part_selector_${pages}`).classList.add("workboard-page-part-selector-selected");
            document.getElementById(`workboard_completed_page_part_${pages}`).classList.remove('hidd');

        }
    });

    document.getElementById("panding_more_cancel_btn").onclick = () => {
        document.getElementById("loading_rounder").classList.remove("hidd");
        fetch('/api/task/agent/cancel/', {
            method: 'POST',
            body: JSON.stringify({ 'panding_id': Number(panding_task_detail['selected_id']), 'otp': document.getElementById("panding_more_otp_text").value })
        })
            .then((response) => response.json())
            .then((result) => {
                console.log('Success:', result);
                if (result.code == 200) {
                    document.getElementById("loading_rounder").classList.add("hidd");
                    document.getElementById("panding_more_detail_popup").classList.add("hidd");
                    clearInterval(panding_task_detail['selected_interval']);
                    short_notification("task removing request sent", 5000);
                }
                else if (result.code == 400) {
                    document.getElementById("loading_rounder").classList.add("hidd");
                    short_notification(result.detail, 5000);
                }
                else if (result.code == 401) {
                    document.getElementById("loading_rounder").classList.add("hidd");
                    short_notification(result.detail, 5000);
                }
                else if (result.code == 405) {
                    document.getElementById("loading_rounder").classList.add("hidd");
                    short_notification(result.detail, 5000);
                }
            })
            .catch((error) => {
                document.getElementById("loading_rounder").classList.add("hidd");
                short_notification(error, 5000);
            });
    }

    document.getElementById("panding_more_complete_btn").onclick = () => {
        document.getElementById("loading_rounder").classList.remove("hidd");
        fetch('/api/task/complete/', {
            method: 'POST',
            body: JSON.stringify({ 'panding_id': Number(panding_task_detail['selected_id']), 'otp': document.getElementById("panding_more_otp_text").value })
        })
            .then((response) => response.json())
            .then((result) => {
                console.log('Success:', result);
                if (result.code == 200) {
                    document.getElementById("loading_rounder").classList.add("hidd");
                    document.getElementById("panding_more_detail_popup").classList.add("hidd");
                    clearInterval(panding_task_detail['selected_interval']);
                    short_notification("task completed request sent", 5000);
                }
                else if (result.code == 400) {
                    document.getElementById("loading_rounder").classList.add("hidd");
                    short_notification(result.detail, 5000);
                }
                else if (result.code == 405) {
                    document.getElementById("loading_rounder").classList.add("hidd");
                    short_notification(result.detail, 5000);
                }
            })
            // .catch((error) => {
            //     document.getElementById("loading_rounder").classList.add("hidd");
            //     short_notification(error, 5000);
            // });
    }

    document.getElementById("completed_task_more_detail").onclick = () => {
        if (completed_task_detail["selected_id"] != "") {
            document.getElementById("page_loading_rounder").classList.remove("hidd");
            console.log("getinfo for", completed_task_detail["selected_id"]);
            get_completed_task_details();
            document.getElementById("completed_more_detail_popup").classList.remove("hidd");
            document.getElementById("page_loading_rounder").classList.add("hidd");
        } else {
            short_notification("please select any task from completed task page", 5000);
        }
    }






    var socket = new WebSocket(`ws://${window.location.host}/ws/expire/`);
    socket.onopen = (e) => {
        console.log("connected");
        socket.send("agent")
        document.getElementById("loading_rounder").classList.add("hidd");
        short_notification("Connected", 3000);
    }

    var pinging = setInterval(() => {
        socket.send("ping")
    }, 3000)

    socket.onmessage = (e) => {
        data = JSON.parse(e.data);
        console.log(data);
        if (data.typex == 'session_expire') {
            clearInterval(pinging);
            short_notification(data.detail, 5000, `location.href = "/";clearInterval(${pinging});`);
        }
        else if(data.typex == "updated")
        {
            received_data = JSON.parse(data.data);
            if(data.accepted == 1)
            {
                if("deadline" in  received_data)
                {
    
                    Array.from(panding_task_detail['selected_deadline_intervals']).forEach((open_inte) => {
                        if(open_inte.id == `${data.panding_id}`)
                        {
                            clearInterval(open_inte.interval);
                            let emt = panding_task_detail['selected_deadline_intervals'].splice(panding_task_detail['selected_deadline_intervals'].indexOf(open_inte), 1);
                        }
                    })
                    panding_task_detail['selected_deadline_intervals'].push({
                        id: `${data.panding_id}`,
                        interval: open_task_reverse_timer(`panding_task_selector_timer_${data.panding_id}`, Number(received_data.deadline))
                    })
                }
                if("image" in received_data)
                {
                    document.getElementById(`panding_task_card_image_${data.panding_id}`).src = `/media/${received_data.image}`;
                }
                document.getElementById("panding_more_detail_popup").classList.add("hidd");
                document.getElementById(`panding_card_${data.panding_id}`).style.backgroundColor = "orange";
                setTimeout(() => {
                    document.getElementById(`panding_card_${data.panding_id}`).style.backgroundColor = "white";
                } , 10000)
                short_notification("your task is updated" , 5000)
            }
            else
            {
                if("deadline" in  received_data)
                {

                    Array.from(open_task_detail['selected_deadline_intervals']).forEach((open_inte) => {
                        if(open_inte.id == `${data.panding_id}`)
                        {
                            clearInterval(open_inte.interval);
                            let emt = open_task_detail["selected_deadline_intervals"].splice(open_task_detail["selected_deadline_intervals"].indexOf(open_inte), 1);
                        }
                    })
                    open_task_detail['selected_deadline_intervals'].push({
                        id: `${data.panding_id}`,
                        interval: open_task_reverse_timer(`open_task_deadline_${data.panding_id}`, Number(received_data.deadline))
                    })
                }
                if("image" in received_data)
                {
                    document.getElementById(`open_task_image_${data.panding_id}`).src = `/media/${received_data.image}`;
                    document.getElementById(`open_task_image_link_${data.panding_id}`).href = `/media/${received_data.image}`;
                    console.log(document.getElementById(`open_task_image_link_${data.panding_id}`))
                    console.log(`/media/${received_data.image}`)
                    
                }
                if("address" in received_data)
                {
                    document.getElementById(`open_task_address_${data.panding_id}`).innerText = received_data.address;
                }
                if("gmap" in received_data)
                {
                    document.getElementById(`open_task_address_location_link_${data.panding_id}`).href = `https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=${JSON.parse(received_data.gmap).lat},${JSON.parse(received_data.gmap).lng}&output=embed`;
                }
            }   
        }
        else if (data.typex == 'notification') {
            if (!open_task_detail['id'].includes(String(data.panding_id))) {

                document.getElementById("open_task_container").innerHTML += `
                <div class="open-task-table-detail" id="open_task_${data.panding_id}">
                <a href="/media/${data.image}" target="_blank" rel="noopener noreferrer" id="open_task_image_link_${data.panding_id}><img id="open_task_image_${data.panding_id}" class="open-task-table-img" src="/media/${data.image}" alt=""></a>
                <div class="open-task-table-name">${data.name}</div>
                <div class="open-task-table-address" id="open_task_address_${data.panding_id}">${data.address}</div>
                <div class="open-task-table-deadline" id="open_task_deadline_${data.panding_id}">...</div>
                <a href="https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=${JSON.parse(`${data.gmaplink}`).lat},${JSON.parse(`${data.gmaplink}`).lng}&output=embed" target="_blank" id="open_task_address_location_link_${data.panding_id}">
                <img class="open-task-table-gmap" src="/static/icon/map_location.svg" alt="">
                </a>
                <div class="open-task-table-choose">
                <div class="open-task-accept-btn" id="open_task_accept_${data.panding_id}">
                Accept
                </div>
                </div>
                </div>
                `;
                open_task_detail['id'].push(`${data.panding_id}`);
                open_task_detail['selected_deadline_intervals'].push({
                    id: `${data.panding_id}`,
                    interval: open_task_reverse_timer(`open_task_deadline_${data.panding_id}`, data.deadline)
                });
                open_task_accept_add_listener();
            }
            if (open_task_detail['id'].length == 0) {
                document.getElementById('empty_message').classList.remove('hidd');
                document.getElementById('outer_open_task_container').classList.add('hidd');
            }
            else {
                document.getElementById('outer_open_task_container').classList.remove('hidd');
                document.getElementById('empty_message').classList.add('hidd');
            }
        }
        else if (data.typex == "expire") {
            // same code as accepted
            Array.from(open_task_detail['selected_deadline_intervals']).forEach((inter_id) => {
                if (inter_id.id == Number(data.panding_id)) {
                    clearInterval(inter_id.interval);
                    let emt = open_task_detail["selected_deadline_intervals"].splice(open_task_detail["selected_deadline_intervals"].indexOf(inter_id), 1)
                }
            })
            document.getElementById(`open_task_${data.panding_id}`).remove();
            let id = open_task_detail['id'].splice(open_task_detail['id'].indexOf(`${data.panding_id}`), 1)
            if (open_task_detail['id'].length == 0) {
                document.getElementById('empty_message').classList.remove('hidd');
                document.getElementById('outer_open_task_container').classList.add('hidd');
            }
            else {
                document.getElementById('outer_open_task_container').classList.remove('hidd');
                document.getElementById('empty_message').classList.add('hidd');
            }
        }
        else if (data.typex == "remove_accepted_task") {
            Array.from(panding_task_detail['selected_deadline_intervals']).forEach((inter_id) => {
                if (inter_id.id == Number(data.panding_id)) {
                    clearInterval(inter_id.interval);
                    let emt = panding_task_detail["selected_deadline_intervals"].splice(panding_task_detail["selected_deadline_intervals"].indexOf(inter_id), 1)
                }
            })
            let id = panding_task_detail['id'].splice(panding_task_detail['id'].indexOf(`${data.panding_id}`), 1)
            document.getElementById(`panding_card_${data.panding_id}`).remove();
            short_notification(`you are no longer assigned for ${id}'s task`, 5000);
        }
        else if (data.typex == "accepted") {
            Array.from(open_task_detail['selected_deadline_intervals']).forEach((inter_id) => {
                if (inter_id.id == Number(data.panding_id)) {
                    clearInterval(inter_id.interval);
                    let emt = open_task_detail["selected_deadline_intervals"].splice(open_task_detail["selected_deadline_intervals"].indexOf(inter_id), 1)
                }
            })
            document.getElementById(`open_task_${data.panding_id}`).remove();
            let id = open_task_detail['id'].splice(open_task_detail['id'].indexOf(`${data.panding_id}`), 1)
            if (open_task_detail['id'].length == 0) {
                document.getElementById('empty_message').classList.remove('hidd');
                document.getElementById('outer_open_task_container').classList.add('hidd');
            }
            else {
                document.getElementById('outer_open_task_container').classList.remove('hidd');
                document.getElementById('empty_message').classList.add('hidd');
            }
        }
        else if (data.typex == "expire_accepted") {
            Array.from(panding_task_detail['selected_deadline_intervals']).forEach((inter_id) => {
                if (inter_id.id == Number(data.panding_id)) {
                    let emt = panding_task_detail["selected_deadline_intervals"].splice(panding_task_detail["selected_deadline_intervals"].indexOf(inter_id), 1)
                }
            })
            let id = panding_task_detail['id'].splice(panding_task_detail['id'].indexOf(`${data.panding_id}`), 1)
            document.getElementById(`panding_card_${data.panding_id}`).remove();
            if (panding_task_detail['id'].length == 0) {
                document.getElementById('panding_empty_message').classList.remove('hidd');
                document.getElementById('panding_card_container').classList.add('hidd');
            }
            else {
                document.getElementById('panding_card_container').classList.remove('hidd');
                document.getElementById('panding_empty_message').classList.add('hidd');
            }

            // code for adding task in expired list in completed page
            gender_ico = ""
            payment_ico = ""
            if(data.gender == "Male")
            {
                gender_ico = "male_symbol.svg";
            }
            else
            {
                gender_ico = "female_symbol.svg";
            }
            if(data.payment_status == "success")
            {
                payment_ico = "panding_round.svg"
            }
            else if(data.payment_status == "panding")
            {
                payment_ico = "panding_round.svg"
            }
            else
            {
                payment_ico = "false_round.svg"
            }
            
            document.getElementById("workboard_completed_page_part_expired").innerHTML += `
            <div class="workboard-completed-page-expired-task-detail">
                <img class="workboard-completed-page-expired-task-detail-profile-img"
                    src="/media/${data.image}" alt="">
                <div class="workboard-completed-page-expired-task-detail-name">
                    ${data.name}</div>
                <img class="workboard-completed-page-expired-task-detail-gender"
                    src="/static/icon/${gender_ico}" alt="">
                <div class="workboard-completed-page-expired-task-detail-mobile">
                    ${data.user_mobile}</div>
                <img class="workboard-completed-page-expired-task-detail-accept"
                    src="/static/icon/${payment_ico}" alt="">
                <div class="workboard-completed-page-expired-task-detail-refid">
                    ${data.task_id}</div>
                <div class="workboard-completed-page-expired-task-detail-select-btn-outer-container">
                    <div class="workboard-completed-page-expired-task-detail-select-btn"
                        id="workboard_completed_page_completed_task_${data.task_id}">
                        Select</div>
                </div>
            </div>
            `;
            completed_task_detail['id'].push(`${data.task_id}`);
            completed_task_select_listener();

            short_notification(`you are no longer eligible for ${id}'s task payment`, 5000);
        }
        else if (data.typex == "newtask") {
            short_notification(`You assigned for ${data.name}'s task`, 3000);
            document.getElementById("loading_rounder").classList.add("hidd");
            if (!panding_task_detail['id'].includes(`${data.panding_id}`)) {

                document.getElementById("panding_card_container").innerHTML += `
                <div class="panding-card" id="panding_card_${data.panding_id}">
                <div class="panding-card-image-container">
                <img class="panding-card-image" src="/media/${data.image}" id="panding_task_card_image_${data.panding_id}"
                alt="">
                </div>
                <div class="panding-card-detail-container">
                <div class="panding-card-name">${data.name}</div>
                <div class="panding-card-timer"
                id="panding_task_selector_timer_${data.panding_id}">...</div>
                </div>
                </div>
                `;
                panding_task_detail['id'].push(`${data.panding_id}`);
                if (panding_task_detail['id'].length == 0) {
                    document.getElementById('panding_empty_message').classList.remove('hidd');
                    document.getElementById('panding_card_container').classList.add('hidd');
                }
                else {
                    document.getElementById('panding_card_container').classList.remove('hidd');
                    document.getElementById('panding_empty_message').classList.add('hidd');
                }
                panding_task_detail['selected_deadline_intervals'].push({
                    id: `${data.panding_id}`,
                    interval: open_task_reverse_timer(`panding_task_selector_timer_${data.panding_id}`, `${data.deadline}`)
                });
                panding_card_more_details_listener();

            }
        }
        else if(data.typex == "completed")
        {
            Array.from(panding_task_detail['selected_deadline_intervals']).forEach((inter_id) => {
                if (inter_id.id == Number(data.panding_id)) {
                    let emt = panding_task_detail["selected_deadline_intervals"].splice(panding_task_detail["selected_deadline_intervals"].indexOf(inter_id), 1)
                }
            })
            let id = panding_task_detail['id'].splice(panding_task_detail['id'].indexOf(`${data.panding_id}`), 1)
            document.getElementById(`panding_card_${data.panding_id}`).remove();

            if (panding_task_detail['id'].length == 0) {
                document.getElementById('panding_empty_message').classList.remove('hidd');
                document.getElementById('panding_card_container').classList.add('hidd');
            }
            else {
                document.getElementById('panding_card_container').classList.remove('hidd');
                document.getElementById('panding_empty_message').classList.add('hidd');
            }
            // code for adding task in completed list in completed page
            gender_ico = ""
            payment_ico = ""
            if(data.gender == "Male")
            {
                gender_ico = "male_symbol.svg";
            }
            else
            {
                gender_ico = "female_symbol.svg";
            }
            if(data.payment_status == "success")
            {
                payment_ico = "true_round.svg"
            }
            else if(data.payment_status == "panding")
            {
                payment_ico = "panding_round.svg"
            }
            else
            {
                payment_ico = "false_round.svg"
            }
            
            document.getElementById("workboard_completed_page_part_completed").innerHTML += `
            <div class="workboard-completed-page-expired-task-detail">
                <img class="workboard-completed-page-expired-task-detail-profile-img"
                    src="/media/${data.image}" alt="">
                <div class="workboard-completed-page-expired-task-detail-name">
                    ${data.name}</div>
                <img class="workboard-completed-page-expired-task-detail-gender"
                    src="/static/icon/${gender_ico}" alt="">
                <div class="workboard-completed-page-expired-task-detail-mobile">
                    ${data.user_mobile}</div>
                <img class="workboard-completed-page-expired-task-detail-accept"
                    src="/static/icon/${payment_ico}" alt="">
                <div class="workboard-completed-page-expired-task-detail-refid">
                    ${data.task_id}</div>
                <div class="workboard-completed-page-expired-task-detail-select-btn-outer-container">
                    <div class="workboard-completed-page-expired-task-detail-select-btn"
                        id="workboard_completed_page_completed_task_${data.task_id}">
                        Select</div>
                </div>
            </div>
            `;
            completed_task_detail['id'].push(`${data.task_id}`);
            completed_task_select_listener();
        }
    }
    window.onbeforeunload = function (event) {
        socket.send("disconnect");
        socket.onclose = (e) => {
            console.log('disconnect');
        }
        return null;
    };


















    // document.getElementById("panding_details_task_accepted").onclick = () => {
    //     window.scrollTo({
    //         top: document.body.scrollHeight,
    //         behavior: 'smooth'
    //     });
    //     console.log("aggent detail grabed");
    // }
    document.getElementById("backtohome").onclick = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }



}