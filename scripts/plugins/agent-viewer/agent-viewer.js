/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var FIVES = FIVES || {};
FIVES.Plugins = FIVES.Plugins || {};

(function() {
    "use strict";

    var _$agentListTable = $("#agentTable");
	var _managedAgents = [];

    var agentViewer = function() {
        this._createTableHeader();
        FIVES.Events.AddEntityAddedHandler(this._handleEntityAdded.bind(this));
        FIVES.Events.AddOnComponentUpdatedHandler(this._handleComponentAttributeChange.bind(this));
    };

    var a = agentViewer.prototype;

    a._handleEntityAdded = function(entity) {
        if(entity["agent"]) {
            if(_managedAgents.indexOf(entity) === -1)
            {
                _managedAgents.push(entity);
            }
            this._createAgentHeaderRow(entity);
            if(entity["agent"]["isPlanning"]) {
                this._createEntriesForPlanningAgent(entity);
                this._highlightIntentionForAgent(entity.guid, entity["agent"]["executedIntention"]);
            }
        }
    };

    a._handleComponentAttributeChange = function(entity, componentName, attributeName) {
        if(componentName === "agent")
        {
            if(attributeName === "intentions") {
                a._rebuildTableForExistingAgents();
                this._handleIntentionChanged(entity);
            }
            else if(attributeName === "executedIntention")
                this._handleExecutedIntentionChanged(entity);
            else if(attributeName === "goal")
                this._handleGoalChanged(entity);
        }
    };

	a._rebuildTableForExistingAgents = function() {
		_$agentListTable.empty();
                this._createTableHeader();
		for(var e in _managedAgents)
		{
			a._handleEntityAdded(_managedAgents[e]);
		}
	};

    a._handleIntentionChanged = function(entity) {
        if(!entity["agent"]["isPlanning"])
        {
            var newIntention = entity["agent"]["intentions"][0];
            var $intentionEntry = $("#in-" + entity.guid + "-0");
            $intentionEntry.text(newIntention);
            this._highlightElementOnChange($intentionEntry);
        }
    };

    a._handleExecutedIntentionChanged = function(entity) {
        this._highlightIntentionForAgent(entity.guid, entity["agent"]["executedIntention"]);
    };

    a._handleGoalChanged = function(entity) {
        var newGoal = entity["agent"]["goal"];
        var $goalEntry = $("#goal-" + entity.guid);
        $goalEntry.text(newGoal);
        this._highlightElementOnChange($goalEntry);
    };

    a._createAgentHeaderRow = function(entity) {
        var agentName = entity["agent"]["name"];
		var intention = "none";
		if(entity["agent"]["intentions"])
			intention = entity["agent"]["intentions"][0];
        var goal = entity["agent"]["goal"];
        this._createTableRowForAgent(entity.guid, agentName, intention, goal);
    };

    a._createEntriesForPlanningAgent = function (entity) {
        var intentions = entity["agent"]["intentions"];
        for(var i = 1; i < intentions.length; i++)
        {
            a._createIntentionEntryForAgent(entity.guid, intentions[i], i);
        }
    };

    a._createTableHeader = function () {
        var $newTableRow = $(
                "<tr><td><b>Agent</b>" +
                "</td><td><b>Intention List</b>" +
                "</td><td><b>Goal</b></td></tr>");
        _$agentListTable.append($newTableRow);
    };

    a._createTableRowForAgent = function (entityGuid, agentName, intention, goal) {
        var $newTableRow = $(
                "<tr><td>" + agentName +
                "</td><td class='intention' id='in-"+ entityGuid +"-0'>" + intention +
                "</td><td class='goal' id='goal-"+ entityGuid +"'>" + goal + "</td></tr>");
        _$agentListTable.append($newTableRow);
    };

    a._createIntentionEntryForAgent = function (entityGuid, intention, index) {
        var $newTableRow = $(
            "<tr><td></td><td class='intention' id='in-"+ entityGuid +"-"+index+"'>" + intention +"</td><td></td></tr>"
        );
        _$agentListTable.append($newTableRow);
    };

    a._highlightIntentionForAgent = function (entityGuid, index) {
        var $intentionEntries = $("[id *= 'in-"+entityGuid + "']");
        for(var i = 0; i < $intentionEntries.length; i++)
        {
            var $intention = $($intentionEntries[i]);
            if(i === index)
                $intention.addClass("highlight");
            else
                $intention.removeClass("highlight");
        }
    };

    a._highlightElementOnChange = function($element) {
        $element.addClass("highlight");
        window.setTimeout(function() {$element.removeClass("highlight");}
            , 1500);
    };

    FIVES.Plugins.AgentViewer = new agentViewer();
    FIVES.SkipLogin = true;
})();


