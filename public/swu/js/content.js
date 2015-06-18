/** @jsx React.DOM */

'use strict';

var ContentArea = React.createClass({

	render: function () {

		console.log("content -- rendering offers " + this.props.offers.length);
        
		return <div id="swu-content" className="content-area container-fluid row">
				<div className="col-md-12" >
                    {
						this.props.offers.map(function (b) {
							// return <SquareOffer data={b} />
							
							return <WideOffer data={b} />
                        }, this)
                    }
				</div>
            </div>
    }
});

// React.renderComponent(<ContentArea />, document.getElementById('main'));