var slideRight = new Menu({
   wrapper: '.wrapper',          // The content wrapper
    type: 'right',             // The menu type
    menuOpenerClass: '.menu-btn',   // The menu opener class names (i.e. the buttons)
    maskId: '#mask'   
});

var slideRightBtn = $('#openRightMenuBtn');

$("#openRightMenuBtn").on('click', function(e) {
   e.preventDefault;
   slideRight.open();
});

$(".pagination li").click(function(e){
    e.preventDefault();
    $(".pagination").find("li").removeClass("active");
    $(this).addClass("active")
})