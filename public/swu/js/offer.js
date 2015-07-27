/** @jsx React.DOM */

'use strict';

// drag

//draggable="true" ondragstart="drag(event)"


var WideOffer = React.createClass( {
    
	handleClick : function (){
		try{
			SWU.rpt("clk", this.props.data.meta.feed, "wide-offer");
			window.open(this.props.data.lnk);
		}
		catch(e){}
	},

	render: function () {

		var desc = this.props.data.desc.short || this.props.data.desc.long;
		var img = this.props.data.img.big || this.props.data.img.small;

		var id = "offer" + Math.floor(Math.random() * 100000);
		
		return <div className="row wow fadeInLeft" id={id} draggable="true" className="myDrgbl" onClick={this.handleClick} >
					<div className="wide-offer col-md-9">
						
						<div className="image col-md-1"><img src={img} /></div>

						<div className="col-md-8">
							<div className="title col-md-4">{desc}</div>
							<div className="price col-md-2">{this.props.data.prc}</div>
							<div className="col-md-1">
								<div className="storeName">From: {this.props.data.store.name}</div>
								{
									this.props.data.store.logo ? (<div className="storeImg"><img src={this.props.data.store.logo} /></div>) : <span/>
								}        
							</div>
						</div>
					</div>
				</div>
	}
});


var SquareOffer = React.createClass( {

        render: function () {

            console.log("square offer");
            
            var desc = this.props.data.desc.short || this.props.data.desc.long;
            var img = this.props.data.img.big || this.props.data.img.small;

            return <div className="border">
                        <div className="square-offer">
                            <div className="title">{desc}</div>
							<div><h2>{this.props.data.meta.feed}</h2></div>
                            <div className="image"><img src={img} /></div>
                            <div className="price">{this.props.data.prc}</div>
                            <div className="storeName">{this.props.data.store.name}</div>
                            {
                                this.props.data.store.logo ? (<div className="storeImg"><img src={this.props.data.store.logo} /></div>) : <span/>
                            }        
                        </div>
                </div>
        }
});
