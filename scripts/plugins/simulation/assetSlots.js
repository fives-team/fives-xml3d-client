// This file is part of FiVES.
//
// FiVES is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License version 3
// (LGPL v3) as published by the Free Software Foundation.
//
// FiVES is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU LGPL License
// along with FiVES.  If not, see <http://www.gnu.org/licenses/>.

var FIVES = FIVES || {};
FIVES.Plugins = FIVES.Plugins || {};

(function (){
    "use strict";

    var assetSlots = function() {
        FIVES.Events.AddEntityGeometryCreatedHandler(_applyAssetSlotEntries);
        FIVES.Events.AddOnComponentUpdatedHandler(_handleEntityComponentUpdated);
    };

    var _applyAssetSlotEntries = function(entity) {
        var slots = entity.assetSlots.slots;
        for(var slot in slots)
        {
            _setAssetInSlot(entity, slot, slots[slot]);
        }
    };

    var _handleEntityComponentUpdated = function(entity, componentName, attributeName) {
        if(componentName === "assetSlots")
        {
            _applyAssetSlotEntries(entity);
        }
    };

    var _setAssetInSlot = function(entity, slotName, resource) {
        var $slotAsset = _getAssetTagForSlot(entity, slotName);
        if(resource && resource !== "")
            _createAssetInSlot($slotAsset, resource);
        else
            _removeAssetFromSlot($slotAsset);
    };

    var _getAssetTagForSlot = function(entity, slotName) {
		var slots = slotName.split('.');
		var toFind = slots.length ? slots[slots.length-1] : slotName;
        var $entityGroup = $(entity.xml3dView.groupElement);
        var $slotAssets = $entityGroup.find("asset[name='" + toFind + "']");
        if($slotAssets.length === 0)
            return _createAssetTagsForSlot($entityGroup, slotName);
        else
            return $slotAssets;
    };

    var _createAssetTagsForSlot = function($entityGroup, slotName) {
        // Our instantiated asset entities do only have one model tag as first
        // child of the parent group node
        var $currentGroup = $entityGroup.children().first();
		var tags = slotName.split('.');
		for (var index in tags) {
			var tagName = tags[index];
			$currentGroup = _createAssetTagWithName($currentGroup, tagName);
		}
        return $currentGroup;
    };

	var _createAssetTagWithName = function($entityGroup, name) {
		var assetTag = XML3D.createElement("asset");
		assetTag.setAttribute("name", name);
		$entityGroup.append(assetTag);
		return $(assetTag);
	};

    var _createAssetInSlot = function($slot, resource) {
        $slot.attr("src", resource);
    };

    var _removeAssetFromSlot = function($slot) {
        $slot.removeAttr("src");
    };

    FIVES.Plugins.Simulation.AssetSlots = new assetSlots();
})();
