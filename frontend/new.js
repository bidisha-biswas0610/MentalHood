//   navbar function 
document.getElementById("loginBtn").addEventListener("click", function () {
    window.location.href = "login.html"; // Redirects to login page
  });

  document.getElementById("signupBtn").addEventListener("click", function () {
    window.location.href = "signup.html"; // Redirects to signup page
  });
$(document).ready(function(){

    $('.fa-bars').click(function(){
        $(this).toggleClass('fa-times');
        $('.navbar').toggleClass('nav-toggle');
    });

    $(window).on('scroll load',function(){
        $('.fa-bars').removeClass('fa-times');
        $('.navbar').removeClass('nav-toggle');

        if($(Window).scrollTop()  >  30){
            $('header').addClass('header-active');
        }else{
            $('header').removeClass('header-active');
        }
    });

    
});