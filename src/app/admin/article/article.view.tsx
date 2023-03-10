import SecuredAPI from "../../utils/SecuredAPI";
import { Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, FormGroup, Icon } from "@mui/material";
import { useMatch, useNavigate } from "@tanstack/react-location";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AdminContext } from "../admin.context";
import ReactMarkdown from "react-markdown";
import { DateTime } from "luxon";
import { Typo } from "../../typo";
import TypoEditor from "../../TypoEditor/TypoEditor";
import TypoUtils from "../../TypoEditor/TypoUtils";

export default function ArticleView () {

	const navigate = useNavigate();

	const { params: {articleId} } = useMatch();
	const { language, list: { categories, loadCategories, loadArticles } } = useContext(AdminContext);

	const [ article, setArticle ] = useState<any>(null);
	const [ isLoading, setIsLoading ] = useState<boolean>(true);
	
	const loadArticle = async () => {
		setIsLoading(true);
		const response = await SecuredAPI.get("article/" + articleId);
		if (response.status === 200) {
			setArticle(response.data);
		}
		setTimeout(() => {
			setIsLoading(false);
		}, 1000);
	}

	const getTitle = () => {
		const title = typeof article.title === "string" ? JSON.parse(article.title) : article.title;
		return title[language];
	}

	const getContent = () => {
		if (article.content === null) return "";
		const content = typeof article.content === "string" ? JSON.parse(article.content) : article.content;
		return content[language];
	}

	const getLastUpdate = () => {
		return DateTime.fromISO(article.updatedAt).toLocaleString(DateTime.DATETIME_MED)
	}

	// [ Delete Article ]
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const deleteArticle = () => {
		setIsDeleteDialogOpen(true);
	}
	const cancelDeleteArticle = () => {
		setIsDeleteDialogOpen(false);
	}
	const submitDeleteArticle = async () => {
		const response = await SecuredAPI.delete("article/" + article.id);
		loadArticles();
		navigate({ to: "/admin/article" });
	}

	// Publish Article
	const publishArticle = async () => {
		const response = await SecuredAPI.put("article/" + article.id + '/publish', {});
		if (response.status === 200) {
			loadArticles();
			setArticle(response.data);
		}
	}
	const unpublishArticle = async () => {
		const response = await SecuredAPI.put("article/" + article.id + '/unpublish', {});
		if (response.status === 200) {
			loadArticles();
			setArticle(response.data);
		}
	}

	// [ Categories Editor ]
	const getCategoryIds = () => {
		if (!article) return [];
		return article.categories.map((cat: any) => cat.category.id);
	};
	const [isEditingCategories, setIsEditingCategories] = useState<boolean>(false);
	const [editorCategories, setEditorCategories] = useState<any[]>(getCategoryIds());
	const editCategories = () => {
		setEditorCategories(getCategoryIds());
		setIsEditingCategories(true);
	};
	const discardEditCategories = () => {
		setEditorCategories(getCategoryIds());
		setIsEditingCategories(false);
	};
	const saveEditCategories = async () => {
		const response = await SecuredAPI.put("article/" + article.id, {
			categoryIds: editorCategories.filter(cat => typeof cat === "number"),
		});
		if (response.status === 200) {
			setArticle(response.data);
			setIsEditingCategories(false);
		}
	};
	const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
		const value = parseInt(event.target.value);
		if (checked) {
			setEditorCategories([...editorCategories, value]);
		} else {
			setEditorCategories(editorCategories.filter(cat => cat !== value));
		}
	};

	// [ Article Editor ]

	const [ articleEdit, setArticleEdit ] = useState<any>(null);
	const [ isEditingArticle, setIsEditingArticle ] = useState<boolean>(false);
	const featuredImageFileSelector = useRef<HTMLInputElement>(null);
	const [ isUploadingFeaturedImage, setIsUploadingFeaturedImage ] = useState<boolean>(false);

	const editArticle = () => {
		setArticleEdit({...article});
	};
	const discardEditArticle = () => {
		setIsEditingArticle(false);
		setArticleEdit(null);
	};
	const saveEditArticle = async () => {
		const response = await SecuredAPI.put("article/" + article.id, articleEdit);
		if (response.status === 200) {
			loadArticles();
			setArticle(response.data);
			setIsEditingArticle(false);
			setArticleEdit(null);
		}
	};

	const getEditTitle = (): string => {
		const title = typeof articleEdit.title === "string" ? JSON.parse(articleEdit.title) : articleEdit.title;
		return title[language];
	}
	const handleEditTitleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (event) => {
		const value = event.target.value;
		setArticleEdit({...articleEdit, title: {...articleEdit.title, [language]: value}});
	};
	const getEditContent = (): string => {
		const content = typeof articleEdit.content === "string" ? JSON.parse(articleEdit.content) : articleEdit.content;
		return content[language];
	}
	const handleEditContentChange = (value: string) => {
		setArticleEdit({...articleEdit, content: {...articleEdit.content, [language]: value}});
	};

	const openFeaturedImageFileSelector = () => {
		if (featuredImageFileSelector.current) {
			featuredImageFileSelector.current.click();
		}
	};
	const removeFeaturedImage = () => {
		setArticleEdit({...articleEdit, photo: null });
	}
	const handleFeaturedImageFileSelector: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
		if (event.target.files && event.target.files.length > 0) {
			setIsUploadingFeaturedImage(true);
			const file = event.target.files[0];
			let formData = new FormData();
			formData.set("file", file);
			const response = await SecuredAPI.post("file", formData);
			if (response.status === 200) {
				setTimeout(() => {
					setIsUploadingFeaturedImage(false);
					setArticleEdit({...articleEdit, photo: response.data.path });
				}, 1000);
			} else {
				console.error(response);
			}
		}
	};

	useEffect(() => {
		setIsEditingArticle(articleEdit !== null);
	}, [articleEdit])

	// [ Initialization ]
	useEffect(() => {
		loadArticle();
		loadCategories();
	}, [articleId])

	if (isLoading) return (
		<div className="ArticleCenter">
			<CircularProgress />
		</div>
	);

	// [ Render UI ]
	return (
		<div className={`ArticleViewer ${isEditingArticle ? 'Edit' : ''}`}>
			<div className="Article">
				<div className="Title">
					{ !isEditingArticle && <h1>{getTitle()}</h1> }
					{ isEditingArticle && <>
						<div className="TitleEditor">
							<label className="EditLabel">Title ({language})</label>
							<textarea value={getEditTitle()} onChange={handleEditTitleChange} placeholder="Enter title..." />
						</div>
					</> }
				</div>

				{<div className="FeaturedImage">
					{ isEditingArticle && <>
						<label className="EditLabel">Featured Image</label>
						<div className="FeaturedImageEditor">
							<div className="Overlay">
								{!articleEdit.photo && !isUploadingFeaturedImage && <>
									<Icon>image</Icon>
									<Button onClick={() => {openFeaturedImageFileSelector()}}>Upload Image</Button>
								</>}
								{articleEdit.photo && !isUploadingFeaturedImage && <>
									<Button className="ChangeButton" variant="contained" onClick={() => {openFeaturedImageFileSelector()}}>Change Image</Button>
									<Button className="ChangeButton" variant="contained" color="error" onClick={() => {removeFeaturedImage()}}>Remove</Button>
								</>}
								{!articleEdit.photo && isUploadingFeaturedImage && <>
									<CircularProgress />
								</>}
							</div>
							{ articleEdit.photo && <img src={articleEdit.photo} /> }
							<input ref={featuredImageFileSelector} onChange={handleFeaturedImageFileSelector} type="file" />
						</div>
					</>}

					{ !isEditingArticle && <img src={article.photo} /> }
				</div>}

				<div className="Content">
					

					{!isEditingArticle && <div dangerouslySetInnerHTML={{__html: TypoUtils.markdownToHTML(getContent())}}></div>}


					{ isEditingArticle && <>
						<label className="EditLabel">Content ({language})</label>
						<TypoEditor value={getEditContent()} onUpdate={handleEditContentChange} options={{
							input: "html",
							showToolbar: false,
							showOtherInput: false,
							showPreview: false,
							showEditorToolbar: false,
						}} />
					</>}
				</div>
			</div>
			<div className="Sidebar">
				
				<div className="SidebarPanel">
					<div className="Title">
						<div className="Label">Article</div>
						<div className="TitleActions">
							{ !isEditingArticle && <>
								<Button onClick={() => {editArticle()}}>Edit Content</Button>
							</>}
							{ isEditingArticle && <>
								<Button color="error" onClick={() => {discardEditArticle()}}>Discard</Button>
								<Button onClick={() => {saveEditArticle()}}>Save</Button>
							</>}
						</div>
					</div>
					<div className="Content">
						<div className="ContentRow">
							<div className="Label">Slug</div>
							<div className="Value">{article.slug}</div>
						</div>
						<div className="ContentRow">
							<div className="Label">Status</div>
							<div className="Value">{article.publishedAt ? "Published" : "Draft"}</div>
						</div>
						<div className="ContentRow">
							<div className="Label">Last Update</div>
							<div className="Value">{getLastUpdate()}</div>
						</div>
					</div>
					<div className="Actions">
						{ article.publishedAt && <Button variant="outlined" onClick={() => {unpublishArticle()}} disabled={isEditingArticle}>Unpublish</Button>}
						{ !article.publishedAt && <Button variant="outlined" color="error" onClick={() => {deleteArticle()}} disabled={isEditingArticle}>Delete Draft</Button>}
						{ !article.publishedAt && <Button variant="contained" onClick={() => {publishArticle()}} disabled={isEditingArticle}>Publish</Button>}
					</div>
				</div>

				<div className="SidebarPanel">
					<div className="Title">
						<div className="Label">Category</div>
						<div className="TitleActions">
							{ !isEditingCategories && <Button onClick={() => { editCategories() }}>Edit</Button> }
							{ isEditingCategories && <>
								<Button color="error" onClick={() => { discardEditCategories() }}>Discard</Button>
								<Button onClick={() => { saveEditCategories() }}>Save</Button>
							</>}
						</div>
					</div>
					<div className="Content">
						{ !isEditingCategories && <>
							{article.categories.length === 0 && <p>This article doesn't belong to any category.</p>}
							{article.categories.length > 0 && <>
								<p>Article belongs to these categories:</p>
								<ul>
									{article.categories.map((cat: any) => (
										<li key={cat.id}>{cat.category.title}</li>
									))}
								</ul>
							</>}
						</>}
						{ isEditingCategories && <>
							<p>Please select one or more categories.</p>
							<FormGroup className="Options">
								{ categories.map(category => (
									<label className="Option" key={category.id}>
										<Checkbox size="small" value={category.id} checked={editorCategories.includes(category.id)} onChange={handleCategoryChange} />
										<div className="Text">{category.title}</div>
									</label>
								))}
							</FormGroup>
						</>}
					</div>
				</div>

			</div>

			{/* Delete Article Dialog */}
			<Dialog
				open={isDeleteDialogOpen}
				onClose={cancelDeleteArticle}
			>
				<DialogTitle>Are you sure want to delete?</DialogTitle>
				<DialogContent>
					<DialogContentText>
						This action cannot be undone. Please proceed with caution.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={cancelDeleteArticle}>No</Button>
					<Button onClick={submitDeleteArticle} autoFocus>Yes</Button>
				</DialogActions>
			</Dialog>
			
		</div>
	);
}