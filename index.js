//const dogoUrl = 'https://api.unsplash.com/photos/random?client_id=1ca24b943b101ddf61c10932bbbdcbfeb23d828f1e8bf6caf28b8dab23457574&query=dogs+funny';

const dogoUrl = 'https://dog.ceo/api/breeds/image/random';

const chuckyQuoteUrl = 'https://api.chucknorris.io/jokes/random';

const imageContainer = document.getElementById('image1');

const chuckNorisDog = document.getElementById('chuckNorisDog');

const button = document.getElementById('getNew');

function fetchData(url)
{
	return new Promise(function(resolve, reject)
	{
		var xhrReq = new XMLHttpRequest();

		xhrReq.open('GET',url);

		xhrReq.addEventListener('load',function(res,fer)
		{
			resolve(JSON.parse(xhrReq.response));
		});

		xhrReq.addEventListener('error',function(res)
		{
			reject(res);
		});

		xhrReq.send();
	});
}

function catchFunction(err)
{
	console.log(err);
}

var cachedDogoUrl = null;

var cachedChuckyUrl = null;

let promiseToFetchDogoAndQuote = null;

let promiseForCache = null;

function renderImageQuoteAndCache()
{
	if(!cachedChuckyUrl || !cachedDogoUrl)
	{
		promiseToFetchDogoAndQuote = Promise.all([fetchData(dogoUrl).then(handleChuckysDogoResponse),fetchData(chuckyQuoteUrl)]);
	}
	else
	{
		promiseToFetchDogoAndQuote = Promise.all([handleChuckysDogoResponse(cachedDogoUrl),cachedChuckyUrl]);
	}

	promiseToFetchDogoAndQuote.then(res =>
	{
		button.classList.add('dogoBarking');

		handleChuckysRespone(res[1]);

		if(!promiseForCache)
		{
			promiseForCache = Promise.all([fetchData(dogoUrl).then(handleCacheDogoResponseFromPromise),fetchData(chuckyQuoteUrl)]);

			return promiseForCache
		}
		else
		{
				return promiseForCache;
		}
	}).then(handleCachedResponeFromPromise).catch(catchFunction);
}

renderImageQuoteAndCache();

button.addEventListener('click',function()
{
	if(!promiseToFetchDogoAndQuote)
	{
		renderImageQuoteAndCache();
	}
});

function handleChuckysDogoResponse(res)
{
		let hiddenImage = document.getElementById('hiddenImage');

		if(hiddenImage)
		{
			let visibleImage = document.getElementById('visibleImage');
			imageContainer.removeChild(visibleImage);
			hiddenImage.className = 'imageTag';
			hiddenImage.setAttribute('id','visibleImage');
		}
		else
		{
			let imageTag = createImageTag('imageTag','visibleImage',res.message);
			imageContainer.innerHTML = "";
			imageContainer.appendChild(imageTag);
		}
}

function handleChuckysRespone(res)
{
	var textNode = document.createTextNode(`${res.value}`);

	chuckNorisDog.innerHTML = '';

	chuckNorisDog.appendChild(textNode);
}

function handleCacheDogoResponseFromPromise(dogoRespone)
{
	cachedDogoUrl = dogoRespone;

	let imageTag = createImageTag('imageTag hidden','hiddenImage',dogoRespone.message);

	imageContainer.appendChild(imageTag);
}

function createImageTag(className,id,src)
{
	let imageTag = document.createElement('img');

	imageTag.className = className;

	imageTag.setAttribute('src',src);

	imageTag.setAttribute('id',id);

	return imageTag;
}

function handleCachedResponeFromPromise(cachedResponse)
{
	cachedChuckyUrl = cachedResponse[1];

	promiseToFetchDogoAndQuote = null;

	promiseForCache = null;

	button.classList.remove('dogoBarking');

	console.log(document.getElementById('hiddenImage'));
}
