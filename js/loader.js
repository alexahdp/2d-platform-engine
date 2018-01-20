export function loadImage(url) {
	return new Promise((res, rej) => {
		const image = new Image(url);
		image.src = url;
		image.addEventListener('load', () => res(image));
	});
}


export async function loadLevel(name) {
	const res = await fetch(`/levels/${name}.json`);
	return res.json();
}
