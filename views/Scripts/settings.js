$(document).ready(function() {
    aboutUpdateBehaviour();
    profilePicUpdateBehaviour();
    logoutBehaviour();
} );

function aboutUpdateBehaviour(){
    $("#changeAbout").click(function(){
       var newAbout = $("#aboutText").val();
       console.log("??");
        $.ajax({
            type:    "POST",
            url:     "/newAbout",
            data:    {"newAbout": newAbout},
            success: function(data) {
                $("#aboutText").val("");
            }
            ,
            // vvv---- This is the new bit
            error:   function(jqXHR, textStatus, errorThrown) {
            }
        });
    });
}

function logoutBehaviour(){
    $("#logout").click(function(){
        $.post("/logout", function(){
            window.location.replace("/login");
        });
    });
}

function profilePicUpdateBehaviour(){
    $("#profileURLBtn").click(function(){
        var newUrl = $("#pictureURL").val();
        $.ajax({
            type:    "POST",
            url:     "/newProfilePic",
            data:    {"picURL": newUrl},
            success: function(data) {
                $("#pictureURL").val("");
            }
            ,
            // vvv---- This is the new bit
            error:   function(jqXHR, textStatus, errorThrown) {
            }
        });
    })
}
