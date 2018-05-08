$(document).ready(function(){
    $.get('/friends', function (user) {
        user.forEach(function(friend){
           if($(".btn_follow").data("content") == friend){
               $(".btn_follow").addClass("followed");
           }
        });
    });
    a();
});

function a(){
    $(".btn_follow").click(function () {
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
        $(this).toggleClass("followed");
    });
}