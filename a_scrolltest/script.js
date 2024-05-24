let currentPage = 1;
let isFetching = false;
let hasMore = true;

let root = document.getElementById('root');

async function fetchData() {
    isFetching = true;
    let response = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${currentPage}`);
    let data = await response.json();
    console.log(data);

    isFetching = false;

    if(data.length === 0) {
        console.log('data length is 0');
        hasMore = false;
        return;
    }

    for (let post of data) {
        let div = document.createElement('div');
        div.innerHTML = `<h2>${post.data}</h2><p>${post.body}</p>`;
        root.appendChild(div);
    }

    currentPage++;
    console.log('++');
}

window.addEventListener('scroll', ()=> {
    console.log('event');
    if (isFetching || !hasMore) {
        return;
    }
    
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight ) {
        console.log('fetching!');
        console.log(window.innerHeight + window.scrollY + '  :  ' + document.body.offsetHeight)
        fetchData();
    }
    
});
fetchData();