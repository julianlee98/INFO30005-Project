$(document).ready(function(){
    $(".btn_follow").click(function () {
        $(".btn_follow").toggleClass("btn_focus");
        $(".btn_follow").toggleClass("make_btn_orange");
        if($(".btn_follow").text() == "Following"){
            $(".btn_follow").text("Follow");
        }
        else{
            $(".btn_follow").text("Following");
        }
    });
});