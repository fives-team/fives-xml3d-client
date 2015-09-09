/*
Copyright (c) 2012-2014
              DFKI - German Research Center for Artificial Intelligence
              www.dfki.de

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
 so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
XML3D.tools.namespace("FIVES");

(function() {
	"use strict";

	FIVES.CameraController = new XML3D.tools.Singleton({
		activeController: null,
		viewGroup: null,
		cameraSensitivity: 0.2, // carefully handcrafted value for the SmartFactory :)

		initialize: function() {
			this.viewGroup = document.getElementById("cameraGroup");
			this.activeController = this._createFlyController();
			this.activeController.attach();
		},

		_createFlyController: function() {
			return new XML3D.tools.MouseKeyboardFlyController(this.viewGroup, {
				rotateSpeed: 5,
				moveSpeed: this.cameraSensitivity,
				controls: {
					rotationActivator: XML3D.tools.MOUSEBUTTON_RIGHT,
					/* WASD is the default setting, but in case someone wants
					 * to change it, it is left here
					 */
					left: XML3D.tools.KEY_A,
					right: XML3D.tools.KEY_D,
					forward: XML3D.tools.KEY_W,
					backward: XML3D.tools.KEY_S
				}
			});
		}
	});
})();