/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function Classroom()
{
    this.places = [];
    this.rooms = [];
    this.size = { width: 3, height: 4 };
    for (var i=0; i < ((this.size.width * 2) * this.size.height); i++)
    {
        this.places.push(null);
        this.rooms.push(null);
    }
}

Classroom.prototype.setupRoom = function()
{
    var self = this;
    var placeIndex = 0;
    for (var i=0; i < this.size.height; i++)
    {
        for (var j=0; j < this.size.width; j++)
        {
            var versionIndex1 = Math.floor(Math.random() * 2);
            self.rooms[placeIndex] = versionIndex1;
            
            var versionIndex2 = Math.floor(Math.random() * 2);
            self.rooms[placeIndex+1] = versionIndex2;
            
            placeIndex = placeIndex + 2;
        }
    }
}

Classroom.prototype.setupStudents = function()
{
    var self = this;
    var placeIndex = 0;
    
    StudentRandomizer.randomize(this.places.length, function(students)
    {
        for (var i=0; i < self.size.height; i++)
        {
            for (var j=0; j < self.size.width; j++)
            {
                var willHaveStudent1 = (Math.random() < 0.9) ? true : false;
                if (willHaveStudent1)
                {
                    with({index: placeIndex})
                    {
                        self.places[index] = students[index];
                        self.draw();
                    }
                }

                var willHaveStudent2 = (Math.random() < 0.9) ? true : false;
                if (willHaveStudent2)
                {
                    with({index: placeIndex})
                    {
                        self.places[index+1] = students[index+1];
                        self.draw();
                    }
                }

                placeIndex = placeIndex + 2;
            }
        }
    });
    
    
    /*for (var i=0; i < this.size.height; i++)
    {
        for (var j=0; j < this.size.width; j++)
        {
            var willHaveStudent1 = (Math.random() < 0.9) ? true : false;
            if (willHaveStudent1)
            {
                with({index: placeIndex})
                {
                    StudentRandomizer.randomize(function(stud) {
                        //console.log("The Student ", stud, " a été crée pour la place " + index + ".");
                        self.places[index] = stud;
                        self.draw();
                    });
                }
            }
            
            var willHaveStudent2 = (Math.random() < 0.9) ? true : false;
            if (willHaveStudent2)
            {
                with({index: placeIndex})
                {
                    StudentRandomizer.randomize(function(stud) {
                        //console.log("The Student ", stud, " a été crée pour la place " + (index+1) + ".");
                        self.places[index+1] = stud;
                        self.draw();
                    });
                }
            }
            
            placeIndex = placeIndex + 2;
        }
    }*/
}

Classroom.prototype.getMoyenne = function()
{
    var count = 0;
    var total = 0;
    for (var i=0; i < this.places.length; i++)
    {
        if (this.places[i] != null)
        {
            count++;
            total += this.places[i].getMoyenne();
        }
    }
    return (total / (count * 20));
}

Classroom.prototype.draw = function()
{
    // Clear the content
    $(".background-game").html("");
    
    // Draw the room
    var left = 335;
    var top = 165;
    var placeIndex = 0;
    for (var i=0; i < this.size.height; i++)
    {
        for (var j=0; j < this.size.width; j++)
        {
            var versionIndex1 = this.rooms[placeIndex];
            var versionIndex2 = this.rooms[placeIndex+1];
            $(".background-game").append('<div class="background-bank" style="background-image: url(img/bank-' + versionIndex1 + '.png); top: ' + top + 'px; left: ' + left + 'px;"></div>');
            $(".background-game").append('<div class="background-bank" style="background-image: url(img/bank-' + versionIndex2 + '.png); top: ' + (top + 15) + 'px; left: ' + (left - 30) + 'px;"></div>');
            
            left = left - 80;
            top = top + 40;
            
            placeIndex = placeIndex + 2;
        }
        
        left = 335 + ((i+1) * 60);
        top = 165 + ((i+1) * 30);
    }
    
    // Draw the students
    var left = 356;
    var top = 159;
    placeIndex = 0;
    for (var i=0; i < this.size.height; i++)
    {
        for (var j=0; j < this.size.width; j++)
        {
            if (this.places[placeIndex] != null)
            {
                var stud = this.places[placeIndex];
                var stanceIndex1 = stud.stanceIndex;
                var hairIndex1 = stud.hairIndex;
                var skinIndex1 = stud.skinIndex;
                var shirtIndex1 = stud.shirtIndex;
                var pantsIndex1 = stud.pantsIndex;
                var feetIndex1 = stud.feetIndex;
                $(".background-game").append('<div id="student-' + (placeIndex) + '" class="background-student" style="background-image: url(img/char-stance-' + stanceIndex1 + '.png); top: ' + top + 'px; left: ' + left + 'px;" onclick="displayStudent(' + (placeIndex) + ');" onmousemove="highlightStudent(event,' + (placeIndex) + ');" onmouseout="unhighlightStudent(' + (i*10 + j) + '0);"></div>');
                $(".background-game #student-" + (placeIndex) + "").append('<div id="student-' + (i*10 + j) + '0-skin" class="background-student-skin" style="background-image: url(img/char-stance-' + stanceIndex1 + '-skin-' + skinIndex1 + '.png);"></div>');
                $(".background-game #student-" + (placeIndex) + "").append('<div id="student-' + (i*10 + j) + '0-shirt" class="background-student-shirt" style="background-image: url(img/char-stance-' + stanceIndex1 + '-shirt-' + shirtIndex1 + '.png);"></div>');
                $(".background-game #student-" + (placeIndex) + "").append('<div id="student-' + (i*10 + j) + '0-hair" class="background-student-hair" style="background-image: url(img/char-stance-' + stanceIndex1 + '-hair-' + hairIndex1 + '.png);"></div>');
            }
            
            if (this.places[placeIndex+1] != null)
            {
                var stud = this.places[placeIndex+1];
                var stanceIndex1 = stud.stanceIndex;
                var hairIndex1 = stud.hairIndex;
                var skinIndex1 = stud.skinIndex;
                var shirtIndex1 = stud.shirtIndex;
                var pantsIndex1 = stud.pantsIndex;
                var feetIndex1 = stud.feetIndex;
                $(".background-game").append('<div id="student-' + (placeIndex+1) + '" class="background-student" style="background-image: url(img/char-stance-' + stanceIndex1 + '.png); top: ' + (top + 15) + 'px; left: ' + (left - 30) + 'px;" onclick="displayStudent(' + (placeIndex+1) + ');" onmousemove="highlightStudent(event,' + (placeIndex+1) + ');" onmouseout="unhighlightStudent(' + (i*10 + j) + '1);"></div>');
                $(".background-game #student-" + (placeIndex+1) + "").append('<div id="student-' + (i*10 + j) + '0-skin" class="background-student-skin" style="background-image: url(img/char-stance-' + stanceIndex1 + '-skin-' + skinIndex1 + '.png);"></div>');
                $(".background-game #student-" + (placeIndex+1) + "").append('<div id="student-' + (i*10 + j) + '0-shirt" class="background-student-shirt" style="background-image: url(img/char-stance-' + stanceIndex1 + '-shirt-' + shirtIndex1 + '.png);"></div>');
                $(".background-game #student-" + (placeIndex+1) + "").append('<div id="student-' + (i*10 + j) + '0-hair" class="background-student-hair" style="background-image: url(img/char-stance-' + stanceIndex1 + '-hair-' + hairIndex1 + '.png);"></div>');
            }
            
            left = left - 80;
            top = top + 40;
            
            placeIndex = placeIndex + 2;
        }
        left = 356 + ((i+1) * 60);
        top = 159 + ((i+1) * 30);
    }
    
    $("#classroom-moyenne-value").html(((this.getMoyenne() * 100) / 5).toFixed(1) + "/20");
}
