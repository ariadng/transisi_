export default class API {

	public static async get (path: string) {
		const url = "/api";
		const response = await fetch(url + "/" + path);
		const json = await response.json();
		return json;
	}

	public static async post (path: string, data: {[key: string]: any}) {
		const url = "/api";
		const response = await fetch(url + "/" + path, {
			method: "POST",
			headers: {
				'Accept': 'application/json',
      			'Content-Type': 'application/json'
			},
			body: JSON.stringify(data),
		});
		const json = await response.json();
		return json;
	}

	public static async put (path: string, data: {[key: string]: any}) {
		const url = "/api";
		const response = await fetch(url + "/" + path, {
			method: "PUT",
			headers: {
				'Accept': 'application/json',
      			'Content-Type': 'application/json'
			},
			body: JSON.stringify(data),
		});
		const json = await response.json();
		return json;
	}

	public static async delete (path: string) {
		const url = "/api";
		const response = await fetch(url + "/" + path, {
			method: "DELETE",
		});
		const json = await response.json();
		return json;
	}

}