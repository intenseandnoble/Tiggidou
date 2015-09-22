$(document).ready(function() {
    $("#datepicker").datepicker();
    $("button").click(function() {
    	var selected = $("#downpicker option:selected").text();
        var datepicker = $("#datepicker").val();

    });
});