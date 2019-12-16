import React, { Component, useState } from 'react';
import './App.scss';
import NavBar from '../NavBar/NavBar';
import Footer from '../Footer/Footer';
import GetRandomColors from '../RandomColor/RandomColor.js';
import { delettePalette, getPalettes, getCatalogs } from '../../util/apiCalls';

class App extends Component {
	constructor() {
		super();
		this.state = {
			arrayOfColors: [],
			userName: '',
			currentCatalog: 0,
			currentPalette: 0,
			userId: 0,
			catalogs: [],
			palettes: [],
			showSaveMenu: false,
			triggerMenu: false
		};
	}

	updateArrayOfColors = colors => {
		this.setState({ arrayOfColors: colors });
	};

	openMenu = () => {
		this.setState({ triggerMenu: true });
	};

	closeMenu = () => {
		this.setState({ triggerMenu: false });
	};

	updateCurrentPalette = id => {
		this.setState({ currentPalette: id });
	};

	closeSaveMenu = () => {
		this.setState({
			showSaveMenu: false
		});
	};

	openSaveMenu = () => {
		this.setState({
			showSaveMenu: true
		});
	};

	wipeUserData = () => {
		this.setState({
			arrayOfColors: [],
			userName: '',
			currentCatalog: 0,
			currentPalette: 0,
			userId: 0,
			catalogs: [],
			palettes: [],
			showSaveMenu: false
		});
	};

	deletePalette = async palette => {
		const { id } = palette;
		await delettePalette(palette);
		this.setState({
			palette: this.state.palettes.filter(palette => palette.id !== id)
		});
	};

	updateCurrentUser = (user, catalogs, palettes) => {
		const { firstName, id } = user;
		this.setState({
			userName: firstName,
			userId: id,
			catalogs: catalogs,
			palettes
		});
	};

	updateCurrentCatalog = id => {
		this.setState({ currentCatalog: id });
	};

	resetCurrentCatalog = () => {
		this.setState({ currentCatalog: 0 });
	};

	fetchPalettes = async (catalogs = this.state.catalogs) => {
		console.log('fetchPalettes is running', catalogs);

		if (this.state.userId && this.state.catalogs.length) {
			const allPalettes = catalogs.map(async catalog => {
				console.log('going through catalogs in fetchPalettes', catalog);

				return await getPalettes(catalog);
			});
			const allResolvedPalettes = await Promise.all(allPalettes);
			console.log('allResolvedPalettes', allResolvedPalettes);

			this.setState({ palettes: allResolvedPalettes.flat() });
		}
	};

	fetchCatalogs = async (id = { id: this.state.userId }) => {
		const catalogs = await getCatalogs({ id });
		this.setState({ catalogs: catalogs });
	};

	render() {
		return (
			<div className='App'>
				<GetRandomColors
					arrayOfColors={this.state.arrayOfColors}
					updateArrayOfColors={this.updateArrayOfColors}
					userID={this.state.userId}
					currentCatalog={this.state.currentCatalog}
					closeSaveMenu={this.closeSaveMenu}
					openSaveMenu={this.openSaveMenu}
					showSaveMenu={this.state.showSaveMenu}
					catalogs={this.state.catalogs}
					resetCurrentCatalog={this.resetCurrentCatalog}
					fetchPalettes={this.fetchPalettes}
					fetchCatalogs={this.fetchCatalogs}
					openMenu={this.openMenu}
				/>
				<NavBar
					userName={this.state.userName}
					catalogs={this.state.catalogs}
					updateCurrentUser={this.updateCurrentUser}
					updateCurrentCatalog={this.updateCurrentCatalog}
					wipeUserData={this.wipeUserData}
					updateCurrentPalette={this.updateCurrentPalette}
					deletePalette={this.deletePalette}
					palettes={this.state.palettes}
					resetCurrentCatalog={this.resetCurrentCatalog}
					fetchPalettes={this.fetchPalettes}
					fetchCatalogs={this.fetchCatalogs}
					currentCatalog={this.state.currentCatalog}
					triggerMenu={this.state.triggerMenu}
					closeMenu={this.closeMenu}
					updateArrayOfColors={this.updateArrayOfColors}
					arrayOfColors={this.state.arrayOfColors}
				/>
				<Footer />
			</div>
		);
	}
}

export default App;
