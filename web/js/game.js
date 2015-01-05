/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var student = null;
var selectedStudentIndex = -1;
var highlightStudentIndex = 0;
var classRoom = null;
var grabbingStudent = null;
var originDragnDrop = -1;

$(document).ready(function()
{
    randomizeClassroom();
});

function randomizeClassroom()
{
    $(".board-clean").show();
    $(".board").hide();
    $(".character-portrait img").attr("src", "img/avatars/avatar-unknown.png");
    $(".character-label-content").html("");
    $("#character-gender-value i").removeClass("fa-female");
    $("#character-gender-value i").removeClass("fa-male");
    
    var aNewClassRoom = new Classroom();
    aNewClassRoom.setupRoom();
    aNewClassRoom.setupStudents();
    classRoom = aNewClassRoom;
    setTimeout(function() { aNewClassRoom.draw(); }, 500);
}

function newRandomizedStudent()
{
    
    StudentRandomizer.randomize(function(stud) {
        student = stud;
        
        console.log(student);
        
        
    });
}

function showTooltip(event,identifier)
{
    var left = event.clientX + 50;
    var top = event.clientY - 40;
    var obj = Behavior.RANDOM_BEHAVIORS[identifier];
    if (obj == null)
        obj = Behavior.SPECIAL_BEHAVIORS[identifier];
    $("#tooltip-0").show();
    $("#tooltip-0").css("left", left);
    $("#tooltip-0").css("top", top);
    $("#tooltip-0 .tooltip-behavior-descriptor h1").html(obj.friendlyName);
    $("#tooltip-0 .tooltip-behavior-descriptor p:not(.commentary)").html(obj.description);
    $("#tooltip-0 .tooltip-behavior-descriptor p.commentary").html(obj.commentary);
}

function hideTooltip()
{
    $("#tooltip-0").hide();
}

function displayStudent(identifier)
{
    try { $("#student-" + selectedStudentIndex).removeClass("selected"); } catch(e) {};
    student = classRoom.places[identifier];
    selectedStudentIndex = identifier;
    $("#student-" + identifier).addClass("selected");
    
    $(".board-clean").hide();
    $(".board").show();
    $(".character-portrait img").attr("src", "img/avatars/avatar-" + student.portraitIndex + ".png");
    $(".character-label-content").html(student.getCompleteName());
    $("#bord-details-moyenne-value").html(student.getMoyenne() + "/20");

    $("#character-gender-value").removeClass("character-gender-female");
    $("#character-gender-value i").removeClass("fa-female");
    $("#character-gender-value").removeClass("character-gender-male");
    $("#character-gender-value i").removeClass("fa-male");
    if (student.gender == Student.GENDER_MALE)
    {
        $("#character-gender-value").addClass("character-gender-male");
        $("#character-gender-value i").addClass("fa-male");
    }
    else
    {
        $("#character-gender-value").addClass("character-gender-female");
        $("#character-gender-value i").addClass("fa-female");
    }

    var val = moyenneBonus = student.getMoyenneBonus();
    $("#board-details-moyenne-bonus-value").removeClass("behavior-buff");
    $("#board-details-moyenne-bonus-value").removeClass("behavior-debuff");
    if (val < 0)
    {

        $("#bord-details-moyenne-bonus-value").html("-" + val);
        $("#board-details-moyenne-bonus-value").addClass("behavior-debuff");
    }
    else
    {
        $("#bord-details-moyenne-bonus-value").html("+" + val);
        $("#board-details-moyenne-bonus-value").addClass("behavior-buff");
    }

    $("#list-behavior").html('');
    for (var i=0; i < student.behaviors.length; i++)
        $("#list-behavior").append('<span onmousemove="showTooltip(event,\'' + student.behaviors[i].identifier + '\')" onmouseout="hideTooltip()" class="behavior-title">' + student.behaviors[i].friendlyName + ' <i class="fa fa-question-circle"></i></span><br/>')

    $("#board-details-stat-label-concentration-percent").css("width", student.getAttributes()["concentration"] + "%");
    $("#board-details-stat-label-humor-percent").css("width", student.getAttributes()["humor"] + "%");
    $("#board-details-stat-label-visibility-percent").css("width", student.getAttributes()["visibility"] + "%");
    
}

function highlightStudent(event,identifier)
{
    if (grabbingStudent != null) { unhighlightStudent(identifier); return; }
    
    var obj = classRoom.places[identifier];
    $("#tooltip-1").show();
    $("#tooltip-1 .tooltip-student-descriptor h1").html(obj.getCompleteName());
    $("#tooltip-1 .tooltip-student-note").html(obj.getMoyenne() + "/20");
    
    var left = event.clientX - ($("#tooltip-1").width()/2);
    var top = event.clientY + 30;
    $("#tooltip-1").css("left", left);
    $("#tooltip-1").css("top", top);
    highlightStudentIndex = identifier;
}

function unhighlightStudent(identifier)
{
    $("#tooltip-1").hide();
    highlightStudentIndex = -1;
}

function startDragnDrop()
{
    if (true) { displayStudent(highlightStudentIndex); return; }
    console.log("start drag and drop");
    $(".background-game").addClass("grabbing");
    
    if (highlightStudentIndex != -1)
    {
        grabbingStudent = classRoom.places[highlightStudentIndex];
        classRoom.places[highlightStudentIndex] = null;
        
        var left = $("#student-" + highlightStudentIndex).position().left;
        var top = $("#student-" + highlightStudentIndex).position().top;
        $("#grab-student").append($("#student-" + highlightStudentIndex));
        $("#grab-student").addClass("grabbing");
        $("#grab-student").show();
        classRoom.draw();
        
        $("#grab-student #student-" + highlightStudentIndex).css("left", 0);
        $("#grab-student #student-" + highlightStudentIndex).css("top", 0);
        
        $("#grab-student").css("left", left);
        $("#grab-student").css("top", top);
        
        
        originDragnDrop = highlightStudentIndex;
        unhighlightStudent(-1);
    }
}

function moveDragnDrop(event)
{
    if (grabbingStudent == null) return;
    
    console.log("move drag and drop");
    
    var left = event.clientX - ($("#grab-student").width()/2);
    var top = event.clientY - 10;
    $("#grab-student").css("left", left);
    $("#grab-student").css("top", top);
    
}

function stopDragnDrop()
{
    console.log("stop drag and drop");
    $(".background-game").removeClass("grabbing");
    $("#grab-student").hide();
    $("#grab-student").html("");
    
    classRoom.places[originDragnDrop] = grabbingStudent;
    grabbingStudent = null;
    originDragnDrop = -1;
    classRoom.draw();
}