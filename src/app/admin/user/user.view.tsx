import SecuredAPI from "../../utils/SecuredAPI";
import React, { ReactNode, useContext, useEffect, useState } from "react";
import { useMatch, useRouter } from "@tanstack/react-location";
import { Button, CircularProgress, Icon, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { AdminContext } from "../admin.context";

export default function UserCard () {

	const { params: {userId} } = useMatch();

	const [user, setUser] = useState<any>(null);
	const [editData, setEditData] = useState<any>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [isLoadingEdit, setIsLoadingEdit] = useState<boolean>(false);

	const adminContext = useContext(AdminContext);

	const loadUser = async () => {
		setIsLoading(true);
		const response = await SecuredAPI.get("user/" + userId);
		if (response.status === 200) {
			setUser(response.data);
			setEditData(user);
		}
		setTimeout(() => {
			setIsLoading(false);
		}, 1000);
	}

	const edit = () => {
		setIsEditing(true);
		setEditData(user);
	}

	const cancelEdit = () => {
		setIsEditing(false);
		setEditData(user);
	}

	const submitEdit = async () => {
		setIsLoadingEdit(true)
		const response = await SecuredAPI.put("user/" + user.id, editData);
		setIsLoadingEdit(false);
		if (response.status === 200) {
			setIsEditing(false);
			loadUser();
		}
	};

	const handleEditChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (event) => {
		event.preventDefault();
		const id = event.target.id;
		const value = event.target.value;
		setEditData({ ...editData, [id]: value });
	};

	const handleRoleEditSelect: ((event: SelectChangeEvent<any>, child: React.ReactNode) => void) = (event) => {
		event.preventDefault();
		const value = event.target.value;
		setEditData({ ...editData, role: value });
	};

	const handleEditSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
		event.preventDefault();
		submitEdit();
	}

	useEffect(() => {
		loadUser();
	}, []);

	if (isLoading) return (
		<CircularProgress />
	);

	else if (user !== null) return (
		<div className="UserCard">
			<div className="Profile">
				<div className="Photo">
					<div className="Initials">{user.name.split(' ').map((a: string) => a[0]).join('')}</div>
				</div>
				{!isEditing && <>
					<div className="Details">
						<div className="Name">{user.name}</div>
						<div className="Meta">
							<div className="MetaItem">
								<Icon>email</Icon>
								<div className="Label">{user.email}</div>
							</div>
							<div className="MetaItem">
								<Icon>assignment_ind</Icon>
								<div className="Label">{user.role}</div>
							</div>
						</div>
					</div>
					<div className="Actions">
						<Button onClick={() => { edit() }}>
							<Icon>edit</Icon>
							<div className="Label">Edit Info</div>
						</Button>
						<Button>
							<Icon>password</Icon>
							<div className="Label">Change Password</div>
						</Button>
						<Button color="error">
							<Icon>delete</Icon>
							<div className="Label">Delete</div>
						</Button>
					</div>
				</>}

				{isEditing && <>
					<div className="UserEdit">
						<div className="Details">
							<form onSubmit={handleEditSubmit}>
								<TextField id="name" value={editData.name} onChange={handleEditChange} label="Name" variant="outlined" fullWidth />
								<TextField id="email" value={editData.email} onChange={handleEditChange} label="Email Address" variant="outlined" fullWidth />
								<Select disabled={editData.id === adminContext?.user?.id} value={editData.role} onChange={handleRoleEditSelect} displayEmpty variant="outlined" labelId="role-label" id="role">
									<MenuItem value="admin">Admin</MenuItem>
									<MenuItem value="editor">Editor</MenuItem>
								</Select>
								<div className="FormActions">
									<Button type="button" onClick={() => {cancelEdit()}}>Cancel</Button>
									<Button variant="contained" type="submit">Save</Button>
								</div>
							</form>
						</div>
					</div>
				</>}

			</div>
		</div>
	);

	return (
		<p>Cannot load user data.</p>
	);
}