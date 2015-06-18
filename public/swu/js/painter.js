/** @jsx React.DOM */

'use strict';

var painter = {

    draw : function (offer) {

        var spot = placer.nextSpot();

        x = this.props.Data.map(function (b) {
            return <Book onBookSelected= { this.handleBookSelected } key = {b} title={b} />            ;
        }, this)

        return x;

    }


};

var placer = {
    
    idx : 0,
    r : 0, // current row
    c : 0, // current col
    matrix : [],

    nextSpot : function () {

    }

};