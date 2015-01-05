/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Student()
{
    var self = this;
    this.firstName = "";
    this.lastName = "";
    this.gender = Student.GENDER_MALE;
    this.portraitIndex = 0;
    
    this.baseMoyenne = 10;
    this.baseConcentration = 50;
    this.baseHumor = 50;
    this.baseVisibility = 50;
    
    this.behaviors = [];
    
    this.stanceIndex = Math.floor(Math.random() * 1);
    this.hairIndex = Math.floor(Math.random() * 12);
    this.skinIndex = Math.floor(Math.random() * 2);
    this.shirtIndex = Math.floor(Math.random() * 6);
    this.pantsIndex = Math.floor(Math.random() * 2);
    this.feetIndex = Math.floor(Math.random() * 2);
}

Student.prototype.getCompleteName = function()
{
    return __capitalizeFirstLetter(this.firstName) + " " + __capitalizeFirstLetter(this.lastName);
    
    function __capitalizeFirstLetter(string)
    {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}

Student.prototype.getMoyenneBonus = function()
{
    var val = this.baseMoyenne - this.getMoyenne();
    return val;
}

Student.prototype.getMoyenne = function()
{
    return this.baseMoyenne;
}

Student.prototype.getAttributes = function()
{
    return {
            concentration: this.baseConcentration,
            humor: this.baseHumor,
            visibility: this.baseVisibility
    };      
}

StudentRandomizer = {};
StudentRandomizer.randomize = function(successCallback)
{
    // We must do a VIP spawn ?
    var vipWillSpawn = (Math.random() < 0.01) ? true : false;
    
    if (!vipWillSpawn)
    {
        $.ajax({
            url: 'http://api.randomuser.me/',
            dataType: 'json',
            success: function(data)
            {
                // Create the student.
                var stud = new Student();
                //console.log(data);

                // Set the portrait and name.
                stud.firstName = data.results[0].user.name.first;
                stud.lastName = data.results[0].user.name.last;
                (data.results[0].user.gender == "male") ? stud.gender = Student.GENDER_MALE : stud.gender = Student.GENDER_FEMALE;
                
                if (stud.gender === Student.GENDER_MALE)
                    stud.portraitIndex = "m-" + Math.floor((Math.random() * 8));
                else
                    stud.portraitIndex = "f-" + Math.floor((Math.random() * 8));

                // Set the moyenne.
                var moyenneOffset = Math.floor((Math.random() * 20));
                stud.baseMoyenne = stud.baseMoyenne + (moyenneOffset - 10);

                // Consider behaviors depending on last properties.
                if (stud.baseMoyenne >= 18)
                {
                    // 10% chance to get "Premier de la classe" custom behavior
                    if (Math.random() <= 1.0)
                    {
                        var beh = Behavior.SPECIAL_BEHAVIORS["first-of-class"];
                        stud.behaviors.push(beh);
                    }
                }

                // Adding some random properties.
                var maxProperties = 2 + Math.floor((Math.random() * 2));
                while (stud.behaviors.length < maxProperties)
                {
                    var keys = Object.keys(Behavior.RANDOM_BEHAVIORS);
                    var r = Math.floor(Math.random() * keys.length);
                    var beh = Behavior.RANDOM_BEHAVIORS[keys[r]];
                    if (stud.behaviors.indexOf(beh) == -1)
                        stud.behaviors.push(beh);
                }

                // Student created!
                successCallback(stud);
            }
        });
    }
    else
    {
        // This will be a VIP yoohoo !
        $.ajax({
            url: '../src/data/vip.json',
            dataType: 'json',
            success: function(data)
            {
                var r = Math.floor(Math.random() * data.length);
                var info = data[r];
                var stud = new Student();
                stud.firstName = info.firstName;
                stud.lastName = info.lastName;
                stud.baseMoyenne = info.moyenne;
                for (var i=0; i < info.behaviors.length; i++)
                {
                    var beh = Behavior.RANDOM_BEHAVIORS[info.behaviors[i]];
                    if (beh != null)
                    {
                        stud.behaviors.push(beh);
                    }
                    else
                    {
                        beh = Behavior.SPECIAL_BEHAVIORS[info.behaviors[i]];
                        stud.behaviors.push(beh);
                    }
                }
                stud.portraitIndex = "vip-" + info.identifier;
                
                successCallback(stud);
            }
        });
    }
}

StudentRandomizer.randomize = function(numberOfStudents, successCallback)
{
    // We must do a VIP spawn ?
    var students = [];
        
    $.ajax({
        url: 'http://api.randomuser.me/?results=' + numberOfStudents,
        dataType: 'json',
        success: function(data)
        {
            for (var i=0; i < numberOfStudents; i++)
            {
                var vipWillSpawn = (Math.random() < 0.03) ? true : false;
                if (vipWillSpawn)
                {
                    $.ajax({
                        url: '../src/data/vip.json',
                        dataType: 'json',
                        success: function(data)
                        {
                            var r = Math.floor(Math.random() * data.length);
                            var info = data[r];
                            var stud = new Student();
                            stud.firstName = info.firstName;
                            stud.lastName = info.lastName;
                            stud.baseMoyenne = info.moyenne;
                            for (var i=0; i < info.behaviors.length; i++)
                            {
                                var beh = Behavior.RANDOM_BEHAVIORS[info.behaviors[i]];
                                if (beh != null)
                                {
                                    stud.behaviors.push(beh);
                                }
                                else
                                {
                                    beh = Behavior.SPECIAL_BEHAVIORS[info.behaviors[i]];
                                    stud.behaviors.push(beh);
                                }
                            }
                            stud.portraitIndex = "vip-" + info.identifier;

                            // Student created!
                            students.push(stud);
                            if (students.length == numberOfStudents)
                                successCallback(students);
                            }
                    });
                }
                else
                {
                    // Create the student.
                    var stud = new Student();
                    //console.log(data);

                    // Set the portrait and name.
                    stud.firstName = data.results[i].user.name.first;
                    stud.lastName = data.results[i].user.name.last;
                    (data.results[i].user.gender == "male") ? stud.gender = Student.GENDER_MALE : stud.gender = Student.GENDER_FEMALE;

                    if (stud.gender === Student.GENDER_MALE)
                        stud.portraitIndex = "m-" + Math.floor((Math.random() * 8));
                    else
                        stud.portraitIndex = "f-" + Math.floor((Math.random() * 8));

                    // Set the moyenne.
                    var moyenneOffset = Math.floor((Math.random() * 20));
                    stud.baseMoyenne = stud.baseMoyenne + (moyenneOffset - 10);

                    // Consider behaviors depending on last properties.
                    if (stud.baseMoyenne >= 18)
                    {
                        // 10% chance to get "Premier de la classe" custom behavior
                        if (Math.random() <= 1.0)
                        {
                            var beh = Behavior.SPECIAL_BEHAVIORS["first-of-class"];
                            stud.behaviors.push(beh);
                        }
                    }

                    // Adding some random properties.
                    var maxProperties = 2 + Math.floor((Math.random() * 2));
                    while (stud.behaviors.length < maxProperties)
                    {
                        var keys = Object.keys(Behavior.RANDOM_BEHAVIORS);
                        var r = Math.floor(Math.random() * keys.length);
                        var beh = Behavior.RANDOM_BEHAVIORS[keys[r]];
                        if (stud.behaviors.indexOf(beh) == -1)
                            stud.behaviors.push(beh);
                    }
                    
                    // Student created!
                    students.push(stud);
                    if (students.length == numberOfStudents)
                        successCallback(students);
                }
            }
        }
    });
}

Student.GENDER_MALE = "male";
Student.GENDER_FEMALE = "female";