$('#search-form').on('submit', searchReddit)

function searchReddit(e) {
    let searchTerm = $('#search-term').val();
    let sortBy = $('input[name = "sort-by"]:checked ').val();
    let limit = $('#limit-select').val();
    


    if (!checkvalidation(searchTerm, sortBy, limit)) showMessage('Invalid input data', 'alert-danger');
    else {
        getData(searchTerm, sortBy, limit)
            .then(data => {
                console.log(data);
                renderHTML(data);
            })
    }
    e.preventDefault();
}

function checkvalidation(searchTerm, sortBy, limit) {
    if (searchTerm == '' || sortBy == undefined || sortBy == '' || limit == undefined) return false;
    return true;
}

function showMessage(message, classname) {
    $(`<div class = "alert ${classname}">${message}</div>`).prependTo('.card-body');

    setTimeout(() => {
        $('.alert').remove();
    }, 3000)
}

function getData(searchTerm, sortBy, limit) {
    return fetch(`http://www.reddit.com/search.json?q=${searchTerm}&sort=${sortBy}&limit=${limit}`)
        .then(res => res.json())
        .then(data => data.data.children.map(res => res.data));
}

function truncate(text, limit){
    let index = text.indexOf(' ', limit);
    if(index != -1) 
        return text.substring(0, index);
    return text;
}

function renderHTML(data) {

    let output = '<div class = "card-columns">'

    data.forEach(post => {
        let image = post.preview ? post.preview.images[0].source.url : './image/no-image-box.png'

        output += `<div class = "card">
            <img class="card-img-top thumbnail" src="${image}" alt="Card image cap">
            <div class="card-body">
                <h5 class="card-title">${post.title}</h5>
                <p class="card-text">${truncate(post.selftext, 100)}</p>
                <a href="${post.url}" class="btn btn-primary" target = "_blank" >Read more</a>
                <hr>
                <span class = "badge badge-secondary">Subreddit: ${post.subreddit}</span>
                <span class = "badge badge-dark">Score: ${post.score}</span>
            </div>
         </div>`;
    })

    output += '</div>';

    $('#results').html(output);
}