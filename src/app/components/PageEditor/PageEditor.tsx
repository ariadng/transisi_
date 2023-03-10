import React, { useEffect, useRef, useState } from "react";
import Block from "../../block/Block";
import SecuredAPI from "../../utils/SecuredAPI";
import "./PageEditor.scss"
import PageEditorContent from "./PageEditorContent";
import PageEditorToolbar from "./PageEditorToolbar";

interface Props {
	pageId: string | number,
}

export default function PageEditor ({
	pageId,
}: Props) {

	const [ page, setPage ] = useState<any | null>(null);
	const [ content, setContent ] = useState<Block | null>(null);

	const loadPage = async () => {
		const response = await SecuredAPI.get("page/" + pageId);
		if (response.status === 200) {
			setPage(response.data);
			const contentObject = Block.objectToBlockInterface(response.data.content);
			if (contentObject === null) return;
			const contentBlock = new Block(contentObject);
			if (contentBlock === null) return;
			setContent(contentBlock);
		}
	};

	useEffect(() => {
		loadPage();
	}, []);

	return (
		<div className="PageEditor Full">

			<PageEditorToolbar />
			<PageEditorContent content={content} />
			
		</div>
	)

}