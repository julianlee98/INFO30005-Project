$(document).ready(function(){
    $(".btn_follow").click(function () {
        // $(".btn_follow").toggleClass("btn_focus");
        // $(".btn_follow").toggleClass("make_btn_orange");
        // if($(".btn_follow").text() == "Following"){
        //     $(".btn_follow").text("Follow");
        // }
        // else{
        //     $(".btn_follow").text("Following");
        // }




        //Button will either have the followed tag or won't
        if($(this).hasClass("followed")){
            $.ajax({
                type: "POST",
                url: "/followPerson",
                data: {"email": $(this).data("content"), "follow": "false"},
                success: function (data, textStatus, xhr) {
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("Error, status = " + textStatus + ", " +
                        "error thrown: " + errorThrown
                    );
                }
            });
        }
        else{
            $.ajax({
                type: "POST",
                url: "/followPerson",
                data: {"email": $(this).data("content"), "follow": "true"},
                success: function (data, textStatus, xhr) {
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("Error, status = " + textStatus + ", " +
                        "error thrown: " + errorThrown
                    );
                }
            });
        }
    });

});