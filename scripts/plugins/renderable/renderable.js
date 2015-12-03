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

(function () {
    "use strict";

    var renderable = function () {
        FIVES.Events.AddEntityAddedHandler(this.addMeshForEntity.bind(this));
        FIVES.Events.AddOnComponentUpdatedHandler(this.updateMesh.bind(this));
    };

    var r = renderable.prototype;

    r.addMeshForEntity = function(entity) {
        if(entity.mesh && entity.mesh.uri)
            FIVES.Resources.ResourceManager.loadExternalResource(entity, this._addMeshToScene.bind(this));
    };

    r._addMeshToScene = function(meshDocument, entityGuid) {
        var entity = FIVES.Models.EntityRegistry.getEntity(entityGuid);
        this._addMeshDefinitionsToScene(entity, meshDocument);
        this._addXml3dGroupsForMesh(entity, meshDocument);
        FIVES.Events.EntityGeometryCreated(entity);
    };

    r._addMeshDefinitionsToScene = function(entity, meshDocument) {
        var _xml3dElement = FIVES.Resources.SceneManager.xml3dElement;
        var meshDefinitions = $(meshDocument).children("defs");
        $(_xml3dElement).append(meshDefinitions);
        entity.xml3dView.defElement = meshDefinitions[0];
    };

    r._addXml3dGroupsForMesh = function(entity, meshDocument) {
        var _xml3dElement = FIVES.Resources.SceneManager.xml3dElement;
        var meshGroup = $(meshDocument).children("group");
        if(meshGroup.length == 0)
            meshGroup = $(meshDocument).children("model");

        var entityGroup = this._createParentGroupForEntity(entity);
        entity.xml3dView.groupElement = entityGroup;
        _xml3dElement.appendChild(entity.xml3dView.groupElement);
        $(entity.xml3dView.groupElement).append(meshGroup);
        this.updateVisibility(entity);
    };

    r._createParentGroupForEntity = function(entity) {
        var entityGroup = XML3D.createElement("group");
        entityGroup.setAttribute("id", "Entity-" + entity.guid);
        entityGroup.setAttribute("transform", "#transform-" + entity.guid );
        return entityGroup;
    };


    r.updateMesh = function(entity, attributeName) {

        if(attributeName === "uri")
        {
            scm.removeEntity(entity);
            scm.addMeshForEntity(entity);
        }
        else if(attributeName === "visible")
        {
            this.updateVisibility(entity);
        }
    };

    r.updateVisibility = function(entity)
    {
        if(entity["mesh"]["visible"])
            $(entity.xml3dView.groupElement).show();
        else
            $(entity.xml3dView.groupElement).hide()
    };

    FIVES.Plugins.Renderable = new renderable();

}());

