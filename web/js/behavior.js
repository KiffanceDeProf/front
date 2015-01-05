/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Behavior(_identifier)
{
    var self = this;
    this.identifier = _identifier;
    this.friendlyName = "";
    this.description = "";
    this.commentary = "";
    this.matrix = {
        concentration: [
                            0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0
                        ],
        humor: [
                            0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0
                        ],
        visibility: [
                            0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0
                        ]
    };
}

Behavior.SPECIAL_BEHAVIORS = [];
Behavior.SPECIAL_BEHAVIORS["firstclass"] = new Behavior("firstclass");

Behavior.RANDOM_BEHAVIORS = [];
$.ajax({
    url: '../src/data/behaviors.json',
    dataType: 'json',
    success: function(data)
    {
        for (var i=0; i < data.length; i++)
        {
            var info = data[i];
            var beh = new Behavior(info.identifier);
            beh.friendlyName = info.name;
            beh.matrix = info.matrix;
            beh.description = info.description;
            beh.commentary = info.commentary;
            if (info.special === true)  
                Behavior.SPECIAL_BEHAVIORS[info.identifier] = beh;
            else
                Behavior.RANDOM_BEHAVIORS[info.identifier] = beh;
        }
    }
});

