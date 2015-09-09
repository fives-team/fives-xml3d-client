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

FIVES.Plugins.Simulation = FIVES.Plugins.Simulation || {};

(function() {
    "use strict";

    var _fivesCommunicator = FIVES.Communication.FivesCommunicator;

    var traceVisualization = function () {
        FIVES.Events.AddConnectionEstablishedHandler(this._registerKiaraFunctions.bind(this));
    };

    var t = traceVisualization.prototype;

    t._registerKiaraFunctions = function()
    {
        this.startTraceVisualization = _fivesCommunicator.connection.generateFuncWrapper("traceVisualization.startTraceVisualization");
		this.stopTraceVisualization = _fivesCommunicator.connection.generateFuncWrapper("traceVisualization.stopTraceVisualization");
    };

    FIVES.Plugins.Simulation.TraceVisualization = new traceVisualization();
}) ();
