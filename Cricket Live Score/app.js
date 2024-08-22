document.addEventListener('DOMContentLoaded', () => {
    const liveBtn = document.querySelector(".live-matches");
    const pastBtn = document.querySelector(".past-matches");
    const container = document.querySelector(".displayMatches");
    const popup = document.createElement('div');
    popup.classList.add('popup');
    document.body.appendChild(popup);

    liveBtn.addEventListener("click", () => {
        document.querySelector(".nav-container nav h1").innerText = "Live Matches";
        container.innerHTML = "";
        fetchLive();
    });

    pastBtn.addEventListener("click", () => {
        document.querySelector(".nav-container nav h1").innerText = "Past Matches";
        container.innerHTML = "";
        fetchPast();
    });

    const fetchLive = async () => {
        try {
            const response = await fetch('https://api.cricapi.com/v1/currentMatches?apikey=48d6fe71-87cb-44c0-a2c2-18205ed32d41&offset=0');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const liveMatches = data.data.filter(match => match.matchStarted && !match.matchEnded);
            displayMatches(liveMatches);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    const fetchPast = async () => {
        try {
            const response = await fetch('https://api.cricapi.com/v1/currentMatches?apikey=48d6fe71-87cb-44c0-a2c2-18205ed32d41&offset=0');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const pastMatches = data.data.filter(match => match.matchEnded);
            displayMatches(pastMatches);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    const displayMatches = (matches) => {
        if (matches.length === 0) {
            container.innerHTML = '<p>No matches currently available.</p>';
            return;
        }

        container.innerHTML = '';
        matches.forEach(match => {
            const matchDiv = document.createElement('div');
            matchDiv.classList.add('match');
            matchDiv.addEventListener('click', () => showPopup(match));

            const matchTitle = document.createElement('h2');
            matchTitle.innerText = match.name;
            matchDiv.appendChild(matchTitle);

            const matchStatus = document.createElement('p');
            matchStatus.innerText = `Status: ${match.status}`;
            matchDiv.appendChild(matchStatus);

            const matchDate = document.createElement('p');
            matchDate.innerText = `Date: ${new Date(match.dateTimeGMT).toLocaleDateString()}`;
            matchDiv.appendChild(matchDate);

            const matchVenue = document.createElement('p');
            matchVenue.innerText = `Venue: ${match.venue}`;
            matchDiv.appendChild(matchVenue);

            const teamInfoDiv = document.createElement('div');
            teamInfoDiv.classList.add('team-info');
            match.teamInfo.forEach(team => {
                const teamDiv = document.createElement('div');
                teamDiv.classList.add('team');

                const teamImg = document.createElement('img');
                teamImg.src = team.img;
                teamImg.alt = team.name;
                teamDiv.appendChild(teamImg);

                const teamName = document.createElement('p');
                teamName.innerText = team.name;
                teamDiv.appendChild(teamName);

                teamInfoDiv.appendChild(teamDiv);
            });
            matchDiv.appendChild(teamInfoDiv);

            if (match.score) {
                const scoresDiv = document.createElement('div');
                scoresDiv.classList.add('scores');
                match.score.forEach(score => {
                    const scoreDiv = document.createElement('div');
                    scoreDiv.classList.add('score');
                    scoreDiv.innerText = `${score.inning}: ${score.r}/${score.w} in ${score.o} overs`;
                    scoresDiv.appendChild(scoreDiv);
                });
                matchDiv.appendChild(scoresDiv);
            }

            container.appendChild(matchDiv);
        });
    };

    const showPopup = (match) => {
        popup.innerHTML = `
            <div class="popup-content">
                <span class="close">&times;</span>
                <h2>${match.name}</h2>
                <p><strong>Status:</strong> ${match.status}</p>
                <p><strong>Date:</strong> ${new Date(match.dateTimeGMT).toLocaleString()}</p>
                <p><strong>Venue:</strong> ${match.venue}</p>
                <h3>Teams</h3>
                ${match.teamInfo.map(team => `
                    <div class="team-popup">
                        <img src="${team.img}" alt="${team.name}">
                        <p>${team.name}</p>
                    </div>
                `).join('')}
                <h3>Scores</h3>
                ${match.score ? match.score.map(score => `
                    <p>${score.inning}: ${score.r}/${score.w} in ${score.o} overs</p>
                `).join('') : '<p>No scores available</p>'}
            </div>
        `;
        popup.style.display = 'block';

        const closeBtn = popup.querySelector('.close');
        closeBtn.addEventListener('click', () => {
            popup.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === popup) {
                popup.style.display = 'none';
            }
        });
    };
});
