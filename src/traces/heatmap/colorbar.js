/**
* Copyright 2012-2016, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/


'use strict';

var isNumeric = require('fast-isnumeric');

var Lib = require('../../lib');
var Plots = require('../../plots/plots');
var makeScaleFunction = require('../../components/colorscale/make_scale_function');
var drawColorbar = require('../../components/colorbar/draw');


module.exports = function colorbar(gd, cd) {
    var trace = cd[0].trace,
        cbId = 'cb' + trace.uid,
        zmin = trace.zmin,
        zmax = trace.zmax;

    if(!isNumeric(zmin)) zmin = Lib.aggNums(Math.min, null, trace.z);
    if(!isNumeric(zmax)) zmax = Lib.aggNums(Math.max, null, trace.z);

    gd._fullLayout._infolayer.selectAll('.' + cbId).remove();

    if(!trace.showscale) {
        Plots.autoMargin(gd, cbId);
        return;
    }

    var cb = cd[0].t.cb = drawColorbar(gd, cbId);
    var sclFunc = makeScaleFunction(trace.colorscale, {
        cmin: zmin,
        cmax: zmax,
        noNumericCheck: true
    });

    cb.fillcolor(sclFunc)
        .filllevels({start: zmin, end: zmax, size: (zmax - zmin) / 254})
        .options(trace.colorbar)();
};
