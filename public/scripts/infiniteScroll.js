let currentCount = 5;
let isFetching = false;
let hasMore = true;

async function fetchData() {
    isFetching = true;
    let response = await fetch(`/dbreq/${currentCount}`);
    let data = await response.json();
    console.log(data);

    isFetching = false;

    console.log('1');

    if (data.length === 0) {
        hasMore = false;
        return
    }

    for (let post of data) {
        let div = document.createElement('div');
        div.innerHTML = `<article class="post-item" onclick="location.href='/post/${post._id}'">
        <h3 id="post-title">
            <a href="/post/${post._id}">
                ${post.title}
            </a>
        </h3>
        <p id="post-item-author">
            <span id="author-name">${post.author.name}</span> | <time datetime="${post.date}" id="date">
                    ${new Date(post.date).toLocaleDateString('kr-KR', {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                    })}
                </time>
        </p>
        <p class="post-item-content">${post.content}</p>
    </article>`
        document.body.appendChild(div);
    }
    currentCount += 5;
}

window.addEventListener('scroll', () => {
    if (isFetching || !hasMore) {
        return
    }

    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        fetchData();
    }
});

// fetchData();