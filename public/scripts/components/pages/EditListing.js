import React from 'react';
import PropEntryForm from './../PropEntryForm';
import ListingModel from './../../models/ListingModel';
import listings from './../../collections/ListingCollection';
import Rayon from 'rayon';
import filepicker from 'filepicker-js';

export default React.createClass({
	getInitialState: function() {
		return {
			listing: new ListingModel(),
			listings: listings,
			delModalVisible: false
		};
	},
	componentDidMount: function() {
		listings.on('update change', this.updateListings);
		listings.fetch({
			data: {
				withRelated: ['user', 'photos']
			}
		});
	},
	componentWillUnmount: function() {
		listings.off('update change');
	},
	updateListings: function() {
		this.setState({listings: listings});
	},
	render: function() {
		const userListings = this.state.listings.filter((val, i, array) => {
			if(val.get('userId') === window.user.id) {
				return true;
			} else {
				return false;
			}
		}).map((val, i, array) => {
			return (
				<option
					label={val.get('address')}
					key={i}
					value={val.get('id')}
					rentSale={val.get('rentSale')}
					price={val.get('price')}
					beds={val.get('beds')}
					baths={val.get('baths')}
					sqft={val.get('sqft')}
					acres={val.get('acres')}
					type={val.get('type')}
					stories={val.get('stories')}
					year={val.get('year')}
					blurb={val.get('blurb')}>
					{val.get('address')}
				</option>
				);
			});
		return (
			<div className="dashboardDiv pageDiv" id="content">
				<a className="breadCrumbs crumbOne" href="/">Home</a><i className="fa fa-angle-right"></i><a className="breadCrumbs" href="/dashboard">Dashboard</a>
				<h1>Edit Listing</h1>
				<div className="editDropdownDiv">
					<select className="editDropdown" name="editDropdown" onChange={this.fillForm}>
						<option value="pick">Choose Listing to Edit</option>
						{userListings}
					</select>
				</div>
				<PropEntryForm model={this.state.listing}
					formChange={this.formChange}
					formSubmit={this.formSubmit}
					clearForm={this.clearForm}
					deleteConfirm={this.deleteConfirm}
					picSubmit={this.picSubmit} />
				<Rayon isOpen={this.state.delModalVisible} onClose={this.delCloseModal} bodyClass="rayon-no-overflow">
					<div className="delConfirmBox">
						<p>Are you sure you want to delete this listing?</p>
						<button className="finalDelete" onClick={this.deleteListing}>Delete</button>
						<button onClick={this.delCloseModal}>Cancel</button>
					</div>
				</Rayon>
			</div>
			);
	},
	picSubmit: function() {
		filepicker.pickMultiple(
			{
			maxFiles: 10,
			conversions: ['crop', 'rotate'],
			cropRatio: 1,
			cropForce: true,
			mimetype: 'image/*'},
  			(Blob) => {
    		this.setState({photos: Blob});
  		});
	},
	fillForm: function(e) {
		this.setState({
			listing: this.state.listings.get(e.target.value)
		});
	},
	formChange: function(e) {
		this.state.listing.set(e.target.dataset.key, e.target.value);
		this.setState({
			listing: this.state.listing
		});
	},
	formSubmit: function(e) {
		e.preventDefault();
		this.state.listing.save({userId: window.user.id}, {
			success: function() {
				this.clearForm;
				this.setState({photos: []});
			}
		});
	},
	clearForm: function() {
		this.state.listing.clear();
	},
	deleteConfirm: function() {
		this.delOpenModal();
	},
	delOpenModal: function() {
		this.setState({
			delModalVisible: true
		});
	},
	deleteListing: function() {		
		this.state.listing.destroy();
		this.delCloseModal();
		this.clearForm();
	},
	delCloseModal: function() {
		this.setState({
			delModalVisible: false
		});
	}
});