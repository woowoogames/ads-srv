/** @jsx React.DOM */

'use strict';

var SBX = React.createClass( {

    handleClick : function () {
        this.props.hndlr.search($("#sbx").val());
    },

    render: function () {
        return <div>
                    <input id="sbx" type="text" className="search-box" placeholder="Enter your search" />
                    <input id="srch" type="button" value="Search" onClick={this.handleClick} />
            </div>
    }
});

var Searched = React.createClass( {

	handleClick : function (e) {
		debugger;
		var st = e.target.innerText;
		this.props.hndlr.search(st);
	},

	render: function () {
		return <div>
                    {
                    	this.props.terms.map(function (b) {
                    		return <div className="searched-item" onClick={this.handleClick} >{b}</div>
                    		}, this)
                    }
            </div>
	}
});