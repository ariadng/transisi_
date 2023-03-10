import React, { useEffect, useState } from "react";
import { Link, Outlet, useMatch, useNavigate, useRouter } from "@tanstack/react-location";
import { Button, CircularProgress, Icon, ToggleButton, ToggleButtonGroup } from '@mui/material';
import "./admin.style.scss";
import SecuredAPI from "../utils/SecuredAPI";
import { AdminContext, AdminContextInterface } from "./admin.context";
import Auth from "../utils/Auth";

export default function AdminLayout () {

	const navigate = useNavigate();
	const router = useRouter();

	const [user, setUser] = useState<any>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		if (user !== null && !isLoading) {
			if (router.state.location.href === "/admin") navigate({ to: "/admin/page" });
		}
		else if (user === null && !isLoading) {
			navigate({ to: "/admin" });
		}
	}, [user, isLoading]);

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

	const handleLanguageSwitch = (
		event: React.MouseEvent<HTMLElement>,
		value: string | null,
	) => {
		if (value !== null) setLanguage(value);
	};

	// [ Admin Context ]
	// - Language
	const [ language, setLanguage ] = useState<string>("en");
	// - Data
	const [ users, setUsers ] = useState<any[]>([]);
	const [ articles, setArticles ] = useState<any[]>([]);
	const [ categories, setCategories ] = useState<any[]>([]);
	const [ pages, setPages ] = useState<any[]>([]);
	const [ components, setComponents ] = useState<any[]>([]);
	// - State
	const [ isLoadingUsers, setIsLoadingUsers ] = useState<boolean>(false);
	const [ isLoadingArticles, setIsLoadingArticles ] = useState<boolean>(false);
	const [ isLoadingCategories, setIsLoadingCategories ] = useState<boolean>(false);
	const [ isLoadingPages, setIsLoadingPages ] = useState<boolean>(false);
	const [ isLoadingComponents, setIsLoadingComponents ] = useState<boolean>(false);

	const contextValue: AdminContextInterface = {
		user: user,
		setUser: setUser,

		// - Language
		language: language,
		setLanguage: setLanguage,

		list: {
			// - Data
			users: users,
			articles: articles,
			categories: categories,
			pages: pages,
			components: components,
			// - Actions
			loadUsers: async () => {
				const response = await SecuredAPI.get("user");
				setUsers(response.data);
			},
			loadArticles: async () => {
				const response = await SecuredAPI.get("article");
				setArticles(response.data);
			},
			loadCategories: async () => {
				const response = await SecuredAPI.get("category");
				setCategories(response.data);
			},
			loadPages: async () => {
				const response = await SecuredAPI.get("page");
				setPages(response.data);
			},
			loadComponents: async () => {
				const response = await SecuredAPI.get("component");
				setComponents(response.data);
			},
			// - State
			isLoadingUsers: isLoadingUsers,
			isLoadingArticles: isLoadingArticles,
			isLoadingCategories: isLoadingCategories,
			isLoadingPages: isLoadingPages,
			isLoadingComponents: isLoadingPages,
		}
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
						<Link to="/admin/component" className="MenuItem" getActiveProps={() => ({ className: 'Active' })}>
							<Icon>dashboard</Icon>
							<span className="Label">Components</span>
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
						<ToggleButtonGroup
							value={language}
							exclusive
							onChange={handleLanguageSwitch}
							size="small"
						>
							<ToggleButton value="en">
								English
							</ToggleButton>
							<ToggleButton value="id">
								Bahasa Indonesia
							</ToggleButton>
						</ToggleButtonGroup>
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