import React, { useState } from 'react';
import './NavBar.scss';
import Fade from 'react-reveal/Fade';
import Palettes from '../Palettes/Palettes';
import Catalogs from '../Catalogs/Catalogs';
import { Route, Link } from 'react-router-dom';
import { getPalettes } from '../../util/apiCalls';
import LoginForm from '../LoginForm/LoginForm';
import logoutIcon from '../../assets/logoutIcon.png';
import UserSignupForm from '../UserSignupForm/UserSignupForm.js';

const NavBar = ({
	userName,
	catalogs,
	updateCurrentUser,
	updateCurrentCatalog,
	wipeUserData
}) => {
	const [menuIsActive, toggleMenu] = useState(false);
	const [palettes, updatePalettes] = useState([]);
	const isSignedIn = userName;

	const fetchPalettes = () => {
		if (isSignedIn && catalogs) {
			const accumulatedPalettes = [];
			catalogs.forEach(async catalog => {
				const palettess = await getPalettes(catalog);
				accumulatedPalettes.push(...palettess);
			});
			updatePalettes(accumulatedPalettes);
		}
	};

	return (
		<>
			<nav className='NavBar'>
				<p className={menuIsActive ? 'active-title' : ''}>Picasso</p>
				<Link
					to={
						isSignedIn
							? menuIsActive
								? '/create'
								: catalogs
								? '/catalogs'
								: '/logout'
							: menuIsActive
							? '/create'
							: '/signup'
					}>
					<div
						className={`hamburger-menu ${menuIsActive &&
							'hamburger-menu-active'}`}
						onClick={() => {
							toggleMenu(!menuIsActive);
							fetchPalettes();
						}}>
						<div className='bar-1'></div>
						<div className='bar-2'></div>
						<div className='bar-3'></div>
					</div>
				</Link>
			</nav>
			<div className={`menu ${menuIsActive && 'show-menu'}`}></div>
			<div className={`menu ${menuIsActive && 'show-menu'}`}>
				<Route path='(/signup|/login)'>
					<div className='access-buttons'>
						<Fade right when={menuIsActive} duration={300} delay={200}>
							<Link to='/login'>
								<button
									className={`login-button ${menuIsActive &&
										'animate-button'}`}>
									Login
								</button>
							</Link>
							<Link to='/signup'>
								<button
									className={`signup-button ${menuIsActive &&
										'animate-button'}`}>
									Sign Up
								</button>
							</Link>
						</Fade>
						<Route exact path='/login'>
							<LoginForm
								updateCurrentUser={updateCurrentUser}
								toggleMenu={toggleMenu}
							/>
						</Route>
						<Route exact path='/signup'>
							<UserSignupForm
								updateCurrentUser={updateCurrentUser}
								toggleMenu={toggleMenu}
							/>
						</Route>
					</div>
					<div className='information-area'>
						<Fade left when={menuIsActive} delay={60} duration={400}>
							<h1>
								Save all of your palettes by creating an <span>account.</span>
							</h1>
						</Fade>
						<div
							className={`hidden-circle ${menuIsActive &&
								'active-circle'}`}></div>
					</div>
				</Route>
				<div className='main-menu'>
					<Route path='/catalogs'>
						<Catalogs
							menuIsActive={menuIsActive}
							catalogs={catalogs}
							updateCurrentCatalog={updateCurrentCatalog}
						/>
						<Link to='/create'>
							<p className='logout-text'>Logout</p>
							<img
								src={logoutIcon}
								className='logout-icon'
								alt='logout button'
								onClick={() => {
									toggleMenu(false);
									wipeUserData();
								}}
							/>
						</Link>
					</Route>
					<Route path='/logout'>
						<div menuIsActive={menuIsActive}></div>
						<Link to='/create'>
							<p className='logout-text'>Logout</p>
							<img
								src={logoutIcon}
								className='logout-icon'
								alt='logout button'
								onClick={() => {
									toggleMenu(false);
									wipeUserData();
								}}
							/>
						</Link>
					</Route>
					<Route
						exact
						path='/catalogs/:id'
						render={({ match }) => {
							const matchingPalettes = palettes.filter(
								palette => palette.catalog_id === parseInt(match.params.id)
							);
							return (
								<Palettes
									menuIsActive={menuIsActive}
									palettes={matchingPalettes}
									toggleMenu={toggleMenu}
								/>
							);
						}}
					/>
				</div>
			</div>
		</>
	);
};

export default NavBar;
