var isToggled = false;
var myNav = document.getElementById('mynav');
window.onscroll = function () { 
    "use strict";
    if (((window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0) >= 200) || isToggled ) {
        myNav.classList.add("nav-colored");
        myNav.classList.remove("navbar-dark");
        myNav.classList.add("navbar-light");
        //myNav.classList.remove("nav-transparent");
    } 
    else {
        //myNav.classList.add("nav-transparent");
        myNav.classList.remove("nav-colored");
        myNav.classList.remove("navbar-light");
        myNav.classList.add("navbar-dark");
    }
};

var toggleBtn = document.querySelector('.navbar-toggler');
toggleBtn.addEventListener('click', function(){
	if(isToggled && ((window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0) >= 200 )){
        isToggled = false;
	} else if(isToggled){
		myNav.classList.remove("nav-colored");
        myNav.classList.remove("navbar-light");
        myNav.classList.add("navbar-dark");
        isToggled = false;
	} else{
		myNav.classList.add("nav-colored");
		myNav.classList.remove("navbar-dark");
		myNav.classList.add("navbar-light");
		isToggled = true;
	}
});
