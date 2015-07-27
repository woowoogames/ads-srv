/** @jsx React.DOM */

'use strict';

var TopBar = React.createClass({
        
    render: function () {
    	return <header id="top" className="container-fluid row">
					<nav className="navbar navbar-inverse navbar-fixed-top cbp-af-header" role="navigation">
						<div className="container-fluid">
						   <div className="navbar-header">
								<a href="#top">
									<img src="../images/partners/logo-small.png" />
								</a>
							</div>
							<div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
								<ul className="nav navbar-nav navbar-right">
									<li><a href="#top">Home</a></li>
									<li><a href="#sights">Partners</a></li>
									<li><a href="#activities">Products</a></li>
									<li><a href="#contact-us">Contact Us</a></li>
								</ul>
							</div>
						</div>
					</nav>
			</header>
    }
});
    
// React.renderComponent(<TopBar />, document.getElementById('main'));

