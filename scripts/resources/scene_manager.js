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
FIVES.Resources = FIVES.Resources || {};

(function (){
    "use strict";

    var SceneManager = function() {};
    var scm = SceneManager.prototype;
    var _mainDefs;

    scm.initialize = function(xml3dElementId) {
        this._getXml3dElement(xml3dElementId);
        this._createMainDefinitions();
        FIVES.Events.AddEntityAddedHandler(this._addXml3dTranformForMesh.bind(this));
    };

    scm._getXml3dElement = function(xml3dElementId) {
        var _xml3dElement = document.getElementById(xml3dElementId);
        if(!_xml3dElement || _xml3dElement.tagName.toUpperCase() != "XML3D")
            console.error("[ERROR] (SceneManager) : Cannot find XML3D element with id " + xml3dElementId);
        this.xml3dElement = _xml3dElement;
    };

    scm._createMainDefinitions = function() {
        _mainDefs = document.createElement("defs");
        _mainDefs.id = "SceneDefinitions";
        this.xml3dElement.appendChild(_mainDefs);
        this.SceneDefinitions = _mainDefs;
    };

    scm.removeEntity = function(entity) {

        if (entity.xml3dView.groupElement) {
            this.xml3dElement.removeChild(entity.xml3dView.groupElement);
            delete entity.xml3dView.groupElement;
        }

        if (entity.xml3dView.transformElement) {
            _mainDefs.removeChild(entity.xml3dView.transformElement);
            delete entity.xml3dView.transformElement;
        }

        if(entity.xml3dView.defElement) {
            this.xml3dElement.removeChild(entity.xml3dView.defElement);
            delete entity.xml3dView.defElement;
        }
    };

    scm._addXml3dTranformForMesh = function(entity) {
        var transformGroup = this._createTransformForEntityGroup(entity);
        entity.xml3dView.transformElement = transformGroup;
    };

    scm._createTransformForEntityGroup = function(entity) {
        var transformTag = document.createElement("transform");
        transformTag.setAttribute("id", "transform-" + entity.guid) ;
        transformTag.translation = this._createTranslationForEntityGroup(entity);
        transformTag.rotation = this._createRotationFromOrientation(entity);
        transformTag.scale = this._createScaleForEntityGroup(entity);
        _mainDefs.appendChild(transformTag);
        return transformTag;
    };

    scm._createTranslationForEntityGroup = function(entity) {
        var position = entity.location.position;
        var xml3dPosition = new XML3D.Vec3(position.x, position.y, position.z);
        return xml3dPosition;
    };

    scm._createRotationFromOrientation = function(entity) {
        var orientation = new XML3D.Quat(
            entity.location.orientation.x,
            entity.location.orientation.y,
            entity.location.orientation.z,
            entity.location.orientation.w);
        return XML3D.AxisAngle.fromQuat(orientation);
    };

    scm._createScaleForEntityGroup = function(entity) {
        var scale = entity.mesh.scale;
        var xml3dScale = new XML3D.Vec3(scale.x, scale.y, scale.z);
        return xml3dScale;
    };

    /**
     * Updates the Orientation of an entity in the XML3D view based on the orientation contained in the entity's
     * orientation attribute.
     * @param entity Entity of which orientation in attributes should be applied to the XML3D View
     */
    scm.applyOrientationToXML3DView = function(entity) {
        var transformationForEntity = entity.getTransformElement();
        if(transformationForEntity)
            transformationForEntity.rotation = this._createRotationFromOrientation(entity);
    };

    /**
     * Updates the Position of an entity in the XML3D view based on the position contained in the entity's
     * position attribute.
     * @param entity Entity of which position in attributes should be applied to the XML3D View
     */
    scm.applyPositionToXML3DView = function(entity) {
        var transformationForEntity = entity.getTransformElement();
        if(transformationForEntity)
            transformationForEntity.translation = this._createTranslationForEntityGroup(entity);
    };

    /**
     * Puts the active view of the XML3D view behind an entity to follow it in third person view. May for example
     * be used by avatar plugin to position the camera behind the user's avatar
     * @param entity Entity that shall be inspected in 3rd person mode
     */
    scm.setCameraViewToEntity = function(entity) {
        var viewGroup = $(this.xml3dElement.view)[0].parentElement;
        var entityTransform = entity.xml3dView.transformElement;
        if(entityTransform)
        {
            var viewTransform = $(viewGroup.getAttribute("transform"))[0];
            viewTransform.rotation = entityTransform.rotation;
            viewTransform.translation = entityTransform.translation;
            var forward = this.getCameraViewDirection();
            viewTransform.translation = viewTransform.translation.subtract(forward.scale(8)).add(new XML3D.Vec3(0,1,0));
        }
    };

    scm.getCameraViewDirection = function() {
        var viewMatrix = $(this.xml3dElement.view)[0].getViewMatrix();
        return new XML3D.Vec3(viewMatrix.m13, viewMatrix.m23, viewMatrix.m33).negate().normalize();
    };

    FIVES.Resources.SceneManager = new SceneManager();
}());
