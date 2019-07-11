const button = document.querySelector('button');

const year_input = document.querySelector('#year');
const week_input = document.querySelector('#week');
const team_input = document.querySelector('#team');
const resultsDiv = document.querySelector('#results');
const apiBase = 'https://api.patrickseute.com/';

button.addEventListener('click', getWeekGames);
document.querySelectorAll('input').forEach(textBox => {
    textBox.addEventListener('keyup', event => {
        if(event.keyCode === 13){
            getWeekGames();
        }
    });
});

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
    result += "(" + play['team'].toUpperCase() + ") "
    if(play['type'] === 'TD'){
        if(play['play_type'] === 'pass'){
            result += `Pass from ${play['passer']} to ${play['player']} for ${play['yards']} yards`;
        }
        else if(play['play_type'] === 'run'){
            result += `Run by ${play['player']} for ${play['yards']} yards`;
        }
        else{
            result += `${play['play_type'].toTitle()} by ${play['player']} for ${play['yards']} yards`;
        }
    }
    else if(play['type'] === 'PAT'){
        result += `Point after good by ${play['player']}`;
    }
    else if(play['type'] === 'FG'){
        result += `Field goal good by ${play['player']} for ${play['yards']} yards`;
    }
    else if(play['type'] === '2PtConv'){
        if(play['play_type'] === 'pass'){
            result += `Two point conversion pass from ${play['passer']} to ${play['player']}`;
        }
        else if(play['play_type'] === 'run'){
            result += `Two point conversion run by ${play['player']}`;
        }

    }
    else if(play['type'] === 'SF'){
        result += `Safety by ${play['player']}`;
    }
    return result + " " + score;
}

function splitInfo(myString){
    return myString.split(/-+/);
}

function clearResults(){
    console.log('Clearing');
    while(resultsDiv.firstChild){
        resultsDiv.removeChild(resultsDiv.firstChild);
    }
    let btn = document.querySelector('#fullbtn');
    if(btn){
        btn.remove();
    }
    let newdiv = document.querySelector('#fulldiv');
    if(newdiv){
        newdiv.remove();
    }
}

function getWeekGames(){
    console.log('Getting week');
    const year = year_input.value;
    const week = week_input.value;

    clearResults();

    let url = apiBase + 'scores/' + year + '/' + week;
    httpGetAsync(url, function(response){
        if(response.length != 0){

            let fullButton = document.createElement('button');
            fullButton.setAttribute('class', 'button button-primary');
            fullButton.setAttribute('id', 'fullbtn');
            fullButton.setAttribute('onclick', 'getFullWeek(' + year + ', ' + week + ')');
            fullButton.appendChild(document.createTextNode('View Full Week'));

            let btnDiv = document.createElement('div');
            btnDiv.setAttribute('class', 'center');
            btnDiv.appendChild(fullButton);
            document.querySelector('.container').insertBefore(btnDiv, resultsDiv);

            response.forEach(function(match){
                let result = document.createElement('div');
                result.setAttribute('class', 'match-result');
                let h6 = document.createElement('h6');
                h6.appendChild(document.createTextNode(match['name']));
                let gameButton = document.createElement('button');
                gameButton.setAttribute('id', match['id']);
                gameButton.setAttribute('onclick', 'getMatchPlays(' + match["id"] + ')')
                gameButton.appendChild(document.createTextNode('Get Plays'));

                result.appendChild(h6);
                result.appendChild(gameButton);
                resultsDiv.appendChild(result);
            });
        }
    });
}

function getFullWeek(year, week){
    const url = apiBase + 'scores/full_week/' + year + '/' + week;
    const newdiv = document.createElement('div');
    newdiv.setAttribute('id', 'fulldiv');
    clearResults();
    httpGetAsync(url, function(response){
        console.log(response['games'][0]['id']);
        response['games'].forEach(function(match){
            const ul = document.createElement('ul');
            const gameTitle = document.createElement('h4');
            gameTitle.setAttribute('class', 'center');
            gameTitle.appendChild(document.createTextNode(match['name']));
            match['plays'].forEach(function(play){
                let li = document.createElement('li');
                li.appendChild(document.createTextNode(createString(play)));
                ul.appendChild(li);
            });
            newdiv.appendChild(gameTitle);
            newdiv.appendChild(ul);
        });
        document.querySelector('.container').appendChild(newdiv);
    });
}

function getMatchPlays(id){
    const url = apiBase + 'scores/' + id;
    const ul = document.createElement('ul');
    clearResults();
    resultsDiv.appendChild(ul);

    httpGetAsync(url, function(response){
        //Generate list of plays
        if(response['scores'].length == 0){
          let li = document.createElement('li');
          li.appendChild(document.createTextNode("No scores found..."));
          ul.appendChild(li);
        } else {
          response['scores'].forEach(function(play){
              let li = document.createElement('li');
              li.appendChild(document.createTextNode(createString(play)));
              ul.appendChild(li);
          });
        }
    });
}
