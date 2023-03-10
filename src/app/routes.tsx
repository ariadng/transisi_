import React from "react";
import AdminLayout from "./admin/admin.layout";
import ArticleCreate from "./admin/article/article.create";
import ArticleIndex from "./admin/article/article.index";
import ArticleLayout from "./admin/article/article.layout";
import ArticleView from "./admin/article/article.view";
import ComponentCreate from "./admin/component/component.create";
import ComponentIndex from "./admin/component/component.index";
import ComponentLayout from "./admin/component/component.layout";
import Editor from "./admin/editor";
import LoginPage from "./admin/login/login.page";
import PageCreate from "./admin/page/page.create";
import PageIndex from "./admin/page/page.index";
import PageLayout from "./admin/page/page.layout";
import PageViewer from "./admin/page/page.view";
import UserCreate from "./admin/user/user.create";
import UserIndex from "./admin/user/user.index";
import UserLayout from "./admin/user/user.layout";
import UserCard from "./admin/user/user.view";
import SitePage from "./site/page";

const AppRoutes = [
	
	
	// Admin
	{ path: "admin", element: <AdminLayout />, children: [
		{ path: "/", element: <LoginPage /> },
		{ path: "page", element: <PageLayout />, children: [
			{ path: "/", element: <PageIndex /> },
			{ path: "/create", element: <PageCreate /> },
			{ path: "/:pageId", element: <PageViewer /> },
		]},
		{ path: "component", element: <ComponentLayout />, children: [
			{ path: "/", element: <ComponentIndex /> },
			{ path: "/create", element: <ComponentCreate /> },
			{ path: "/:slug", element: <PageViewer /> },
		]},
		{ path: "article", element: <ArticleLayout />, children: [
			{ path: "/", element: <ArticleIndex /> },
			{ path: "/create", element: <ArticleCreate /> },
			{ path: "/:articleId", element: <ArticleView /> },
		]},
		{ path: "user", element: <UserLayout />, children: [
			{ path: "/", element: <UserIndex /> },
			{ path: "create", element: <UserCreate /> },
			{ path: "/:userId", element: <UserCard /> },
		]},
		{ path: "settings", element: "admin settings" },
		{ path: "account", element: "admin account" },
		{ path: "editor", element: <Editor /> },
	]},

	// Site
	{ path: "/", element: <SitePage /> },
	{ path: "/:slug", element: <SitePage /> },
]

export default AppRoutes;