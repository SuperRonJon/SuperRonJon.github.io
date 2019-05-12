const button = document.querySelector('button');

const year_input = document.querySelector('#year');
const week_input = document.querySelector('#week');
const team_input = document.querySelector('#team');
const ul = document.querySelector('#list')

function httpGetAsync(url, callback){
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function(){
        if(xmlHttp.readyState === 4 && xmlHttp.status === 200){
            callback(JSON.parse(xmlHttp.responseText));
        }
    };
    xmlHttp.open('GET', url, true);
    xmlHttp.send(null);
}

function createString(play){
    let result = ""
    if(play['type'] === 'TD'){
        if(play['play_type'] === 'pass'){
            result = `Pass from ${play['passer']} to ${play['player']} for ${play['yards']} yards`;
        }
        else if(play['play_type'] === 'run'){
            result = `Run by ${play['player']} for ${play['yards']} yards`;
        }
        else{
            result = `${play['play_type']} by ${play['player']}`;
        }
    }
    else if(play['type'] === 'PAT'){
        result = `Point after good by ${play['player']}`;
    }
    else if(play['type'] === 'FG'){
        result = `Field goal good by ${play['player']} for ${play['yards']} yards`;
    }
    else if(play['type'] === '2PtConv'){
        if(play['play_type'] === 'pass'){
            result = `Two point conversion pass from ${play['passer']} to ${play['player']}`;
        }
        else if(play['play_type'] === 'run'){
            result = `Two point conversion run by ${play['player']}`;
        }

    }
    else if(play['type'] === 'SF'){
        result = `Safety by ${play['team']}`;
    }
    return result;
}

button.addEventListener('click', event => {
    const year = year_input.value;
    const week = week_input.value;
    const team = team_input.value;

    let url = 'http://localhost:5000/scores/' + year + '/' + week;

    if(team.toLowerCase() !== 'all' && team !== ''){
        console.log(team)
        url += '/' + team;
    }

    let li = document.createElement('li');
    li.appendChild(document.createTextNode('Searching...'));
    li.setAttribute('id', 'searching');
    ul.appendChild(li);

    httpGetAsync(url, function(response){
        console.log(response);
        document.querySelector('#searching').remove()
        response.forEach(function(play){
            let li = document.createElement('li');
            li.appendChild(document.createTextNode(createString(play)));
            ul.appendChild(li);
        });
    });
});
