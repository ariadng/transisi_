import React, { useEffect, useState } from "react";
import { Link, Outlet, useMatch, useNavigate } from "@tanstack/react-location";
import { Button, CircularProgress, Icon } from '@mui/material';
import "./admin.style.scss";
import SecuredAPI from "../utils/SecuredAPI";
import { AdminContext, AdminContextInterface } from "./admin.context";
import Auth from "../utils/Auth";

export default function AdminLayout () {

	const navigate = useNavigate();

	const [user, setUser] = useState<any>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		if (user !== null) navigate({ to: "/admin/page" });
		else navigate({ to: "/admin" })
	}, [user]);

	const logout = async () => {
		setIsLoading(true);
		await SecuredAPI.get("auth/logout");
		localStorage.clear();
		setUser(null);
		navigate({ to: "/admin" });
	};

	// [ Set initial data ]
	// Set user
	const loadUser = async () => {
		const userData = await Auth.getUser();
		setUser(userData);
	};
	// Initialize
	useEffect(() => {
		loadUser();
	}, []);
	// User changed
	useEffect(() => {
		setTimeout(() => {
			setIsLoading(false);
		}, 1000);
	}, [user]);

	const contextValue: AdminContextInterface = {
		user: user,
		setUser: setUser,
	};
	
	if (isLoading) return (
		<div className="AdminLayout">
			<div className="Loading">
				<CircularProgress />
			</div>
		</div>
	);
	
	return (
		<AdminContext.Provider value={contextValue}>
			<div className="AdminLayout">
				{user && <div className="AppBar">
					<div className="Brand">
						<div className="Title">Transisi</div>
					</div>
					<div className="Menu">
						<Link to="/admin/page" className="MenuItem" getActiveProps={() => ({ className: 'Active' })}>
							<Icon>auto_stories</Icon>
							<span className="Label">Pages</span>
						</Link>
						<Link to="/admin/article" className="MenuItem" getActiveProps={() => ({ className: 'Active' })}>
							<Icon>newspaper</Icon>
							<span className="Label">Articles</span>
						</Link>
						<Link to="/admin/user" className="MenuItem" getActiveProps={() => ({ className: 'Active' })}>
							<Icon>people</Icon>
							<span className="Label">Users</span>
						</Link>
						<Link to="/admin/settings" className="MenuItem" getActiveProps={() => ({ className: 'Active' })}>
							<Icon>settings</Icon>
							<span className="Label">Settings</span>
						</Link>
					</div>
					<div className="Actions">
						<Link to="/admin/account" className="MenuItem" getActiveProps={() => ({ className: 'Active' })}>
							<Icon>account_circle</Icon>
							<span className="Label">{user.name}</span>
						</Link>
						<Button variant="text" onClick={() => { logout() }}>Logout</Button>
					</div>
				</div>}
				<div className="AppContent">
					<Outlet />
				</div>
			</div>
		</AdminContext.Provider>
	)

}