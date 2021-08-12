



window.onload = () => {

    document.getElementById("loading_rounder").classList.add("hidd");
    document.getElementById("password").addEventListener("keyup", function(event) {
        document.getElementById("login_btn").click();
    });
    var favi = document.querySelector("link[rel~='icon']");

    document.getElementById("signup_go_btn").onclick = () => {
        document.getElementById("login_box").style.display = "none";
        document.getElementById("signup_box").style.display = "flex";
    }
    document.getElementById("login_go_btn").onclick = () => {
        document.getElementById("signup_box").style.display = "none";
        document.getElementById("login_box").style.display = "flex";
    }
    
    document.getElementById("login_btn").onclick = () => {
        favi.href="/static/icon/favicon_offline.svg";
        if (document.getElementById("tandcbx_login").checked) {
            let username = document.getElementById("username").value;
            let password = document.getElementById("password").value;
            fetch('/api/login/', {
                method: 'POST',
                headers : {'X-CSRFToken' : getCookie('csrftoken')},
                body: JSON.stringify({
                    "username": username,
                    "password": password
                })
                })
                .then((response) => response.json())
                .then((result) => {
                    favi.href="/static/icon/fav.svg";
                    if (result.code == 200) {
                        location.href = '/dashboard/'
                    } else if (result.code == 404) {
                        short_notification(`${result.detail}`, 3000);
                    } else if (result.code == 405) {
                        short_notification(`${result.detail}`, 3000);
                    } else if (result.code == 406) {
                        short_notification(`${result.detail}`, 3000);
                    } else if (result.code == 505) {
                        short_notification(`${result.detail}`, 3000);
                    }
                })

            } else {
            favi.href="/static/icon/fav.svg";
            short_notification("please accept&nbsp;<b>terms and condition for login</b>");
        }
    }


    document.getElementById("signup_btn").onclick = () => {
        favi.href="/static/icon/favicon_offline.svg";
        if (document.getElementById("tandcbx_signup").checked) {
            errors = "<p>"
            errflag = false
            let fname = document.getElementById("signup_fname").value;
            let lname = document.getElementById("signup_lname").value;
            let username = document.getElementById("signup_username").value;
            let password = document.getElementById("signup_password").value;
            let email = document.getElementById("signup_email").value;
            let mobile = document.getElementById("signup_mobile").value;
            let address = document.getElementById("signup_address").value;
            let pincode = document.getElementById("signup_pincode").value;
            var emailpattern=/^[a-zA-Z0-9.!#$%&'*/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;////Regular expression
	        if(!(emailpattern.test(email)))
            {
                errors += " Invalid EMAIL (+ symbol not allowed) ";
                errflag = true;
            }
	        if(!(/[0-9]{10}/.test(mobile)))
            {
                errors += " Invalid MOBILE NUMBER ";
                errflag = true;
            }
	        if(!(/[0-9]{6}/.test(pincode)))
            {
                errors += " Invalid PINCODE ";
                errflag = true;
            }
	        if(!(/[0-9A-Za-z]{5,}/.test(username)))
            {
                errors += " USERNAME should only contains Latters and numbers with min length of 5 ";
                errflag = true;
            }
	        if(!(/[0-9A-Za-z@#$&^*"'/!~`|+-_=]{5,}/.test(password)))
            {
                errors += " PASSWORD has Min length should be 5 and should not contains % or \\ or any breckets ";
                errflag = true;
            }
            errors += "</p>";
            if(errflag == true)
            {
                if(errors.length > 65)
                {
                    short_notification(errors , 15000);
                }
                else
                {
                    short_notification(errors);
                }
                favi.href="/static/icon/fav.svg";
            }
            else
            {
                fetch('/api/signup/', {
                    method: 'POST',
                    headers : {'X-CSRFToken' : getCookie('csrftoken')},
                    body: JSON.stringify({
                        "fname": fname,
                        "lname": lname,
                        "username": username,
                        "password": password,
                        "email": email,
                        "mobile": mobile,
                        "address": address,
                        "pincode": pincode
                    })
                })
                .then((response) => response.json())
                .then((result) => {
                        favi.href="/static/icon/fav.svg";
                        if (result.code == 200) {
                            document.getElementById("login_go_btn").click();
                        } else if (result.code == 404) {
                            short_notification(`${result.detail}`, 3000);
                        } else if (result.code == 405) {
                            short_notification(`${result.detail}`, 3000);
                        } else if (result.code == 406) {
                            short_notification(`${result.detail}`, 3000);
                        } else if (result.code == 505) {
                            short_notification(`${result.detail}`, 3000);
                        }
                    });
            }
        }
        else {
            favi.href="/static/icon/fav.svg";
            short_notification("please accept&nbsp;<b>terms and condition for signup</b>");
        }
    }
}