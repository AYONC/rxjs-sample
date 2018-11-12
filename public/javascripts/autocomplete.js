const { fromEvent } = rxjs;
const { map, mergeAll, mergeMap, debounceTime, filter, distinctUntilChanged } = rxjs.operators;
const { ajax } = rxjs.ajax;

const $layer = document.getElementById("suggestLayer");

function drawLayer(items) {
  $layer.innerHTML = items.map(user => {
    return `<li class="user">
    <img src="${user.avatar_url}" width="50px" height="50px"/>
    <p><a href="${user.html_url}" target="_blank">${user.login}</a></p>
    </li>`
  }).join('');
}

const user$ = fromEvent(document.getElementById("search"), "keyup").pipe(
  map(event => event.target.value),
  map(query => ajax.getJSON(`https://api.github.com/search/users?q=${query}`)),
  mergeAll(),
);

/*
const user$ = fromEvent(document.getElementById('search'), 'keyup')
  .pipe(
    debounceTime(300), // 300ms 뒤에 데이터를 전달한다.
    map(event => event.target.value),
    distinctUntilChanged(),  // 특수키가 입력된 경우에는 나오지 않기 위해 중복 데이터 처리
    filter(query => query.trim().length > 0),
    mergeMap(query => ajax.getJSON(`https://api.github.com/search/users?q=${query}`)),
  );
*/

user$.subscribe(v => {
  drawLayer(v.items);
});
