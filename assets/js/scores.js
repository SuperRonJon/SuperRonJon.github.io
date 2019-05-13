const button = document.querySelector('button');

const year_input = document.querySelector('#year');
const week_input = document.querySelector('#week');
const team_input = document.querySelector('#team');
const ul = document.querySelector('#list')

String.prototype.toTitle = function(){
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

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

//Creates specific string depending on play type
function createString(play){
    let result = "";
    const re = /\d+\-\d+/;
    const score_str = play['score'];
    const score = `(${score_str.match(re)[0]})`;
    play['play_type'] = play['play_type'].toTitle()
    if(play['type'] === 'TD'){
        if(play['play_type'] === 'pass'){
            result = `Pass from ${play['passer']} to ${play['player']} for ${play['yards']} yards`;
        }
        else if(play['play_type'] === 'run'){
            result = `Run by ${play['player']} for ${play['yards']} yards`;
        }
        else{
            result = `${play['play_type']} by ${play['player']} for ${play['yards']} yards`;
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
        result = `Safety by ${play['player']}`;
    }
    return result + " " + score;
}

button.addEventListener('click', getPlays);
document.querySelectorAll('input').forEach(textBox => {
    textBox.addEventListener('keyup', event => {
        if(event.keyCode === 13){
            getPlays();
        }
    });
});

function getPlays(){
    const year = year_input.value;
    const week = week_input.value;
    const team = team_input.value;

    let url = 'http://localhost:5000/scores/' + year + '/' + week;

    //Test if searching for specific team
    if(team.toLowerCase() !== 'all' && team !== ''){
        url += '/' + team;
    }

    //Clear list and create searching notification
    while(ul.firstChild){
        ul.removeChild(ul.firstChild);
    }
    let li = document.createElement('li');
    li.appendChild(document.createTextNode('Searching...'));
    li.setAttribute('id', 'searching');
    ul.appendChild(li);

    //Request url
    httpGetAsync(url, function(response){
        //Remove searching notification
        document.querySelector('#searching').remove()
        //Generate list of plays
        response.forEach(function(play){
            let li = document.createElement('li');
            li.appendChild(document.createTextNode(createString(play)));
            ul.appendChild(li);
        });
    });
}
