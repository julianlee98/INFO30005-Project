$(document).ready(function() {
    aboutUpdateBehaviour();
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
