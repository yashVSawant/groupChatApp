const showRequests = document.getElementById('showRequests');
const back = document.getElementById('back');
const search = document.getElementById('search');
const showSearchedResults = document.getElementById('showSearchedResults')
const token = localStorage.getItem('grpChatappToken');


window.addEventListener('DOMContentLoaded',async()=>{
    try{
       const getRequests = await axios.get(`/group/getRequests`,{headers:{'Authorization':token}})
       getRequests.data.requests.forEach(element => {
        console.log(element)
        displayRequests(element.group.name,element.groupId)
       });
    }catch(err){
        console.log(err)
    }
})
back.addEventListener('click',()=>{
    location.href='../chatHomePage/chatHomePage.html'
})
showRequests.addEventListener('click',async(e)=>{
    if(e.target.classList.contains('accept')){
        try{
            const id=e.target.id;
            console.log(id);
            await axios.post(`/group/acceptRequest`,{groupId:id},{headers:{'Authorization':token}})
            e.target.parentNode.removeChild(e.target)
        }catch(err){
            console.log(err)
        }
    }
})

search.addEventListener('click',async()=>{
    const text = document.getElementById('text').value;
    const getSearched = await axios.get(`/group/search?text=${text}`,{headers:{'Authorization':token}})
    showSearchedResults.innerHTML='';
    if(getSearched.data.success){
        if(getSearched.data.users){
            // console.log(getSearched.data.users[0])
            displaySearchResult(getSearched.data.users[0].name,getSearched.data.users[0].phoneNo);
        }else{
            getSearched.data.group.forEach((item)=>{
                console.log(item)
                displaySearchResultGroup(item.group.name,item.group.id)
            })
        }
    }else{
        const showError = document.getElementById('showError');
        showError.innerHTML='<h2>no result found</h2>'
        showError.style.color ='yellow';
        setTimeout(()=>{
            showError.innerHTML=''
        },2000)
    }
    document.getElementById('text').value="";
})

showSearchedResults.addEventListener('click',async(e)=>{
    console.log(e.target);
    if(e.target.classList.contains('joinGroup')){
        console.log(e.target.id);
        const groupId=e.target.id;
        await axios.post(`/group/acceptRequest`,{groupId},{headers:{'Authorization':token}})
        e.target.parentNode.removeChild(e.target)
    }else if(e.target.classList.contains('makeFriend')){
        console.log(e.target.id);
    }
})

function displayRequests(groupName,groupId){
    const div = document.createElement('div');
    div.innerHTML=`${groupName}<button class="accept" id="${groupId}">Accept</button>`;
    showRequests.appendChild(div);
}

function emitJoinGroup(){
    socket.emit('join-group',groupId);
}

function displaySearchResult(name,phone){
    const div = document.createElement('div');
    div.innerHTML=`${name} <button class='makeFriend' id='${phone}'>make Friend</button>`
    showSearchedResults.appendChild(div)
}

function displaySearchResultGroup(name,id){
    const div = document.createElement('div');
    div.innerHTML=`${name} <button class='joinGroup' id='${id}'>join group</button>`
    showSearchedResults.appendChild(div)
}