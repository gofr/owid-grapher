// @flow

import * as _ from '../libs/underscore'
import * as d3 from '../libs/d3.v4'
import owid from '../owid'
import dataflow from './owid.dataflow'
import Bounds from './Bounds'
import { h, render, Component, cloneElement } from 'preact'
import { observable, computed, asFlat } from 'mobx'
import { bind } from 'decko'
import type ChoroplethData from './ChoroplethMap'
import type MapProjection from './ChoroplethMap'
import ChoroplethMap from './ChoroplethMap'
import Timeline from './Timeline'
import {NullElement} from './Util'

class DataTab extends Component {
	props: {
		bounds: Bounds,
		csvUrl: string
	}

	@computed get bounds() {
		return this.props.bounds
	}

	@computed get csvUrl() {
		return this.props.csvUrl
	}

	@computed get csvFilename() {
		const m = this.csvUrl.match(/\/([^\/]*)$/)
		return m && m[1]
	}

	render() {
		const { bounds, csvUrl, csvFilename } = this

		return <div class="dataTab" style={_.extend(bounds.toCSS(), { position: 'absolute' })}>
			<div>
				<p>Download a CSV file containing all data used in this visualization:</p>
				<a href={csvUrl} class="btn btn-primary" target="_blank"><i class="fa fa-download"></i> {csvFilename}</a>
			</div>
		</div>
	}
}

;(function() {	
	"use strict";
	owid.namespace("owid.component.dataTab");

	owid.component.dataTab = function(chart) {
		var dataTab = owid.dataflow();

		dataTab.isOverlay = true;

		let rootNode = null

		dataTab.render = function(bounds) {
	        rootNode = render(<DataTab bounds={bounds.scale(chart.scale)} csvUrl={Global.rootUrl+'/'+chart.model.get('slug')+'.csv'}/>, chart.htmlNode, rootNode)
		};

		dataTab.beforeClean(function() {
			if (dataTab.el) render(NullElement, chart.htmlNode, rootNode);
		});

		return dataTab;
	};
})();