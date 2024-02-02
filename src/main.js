let formatTitle = () => {
    let width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    let titleElem = document.getElementById('profile-title');
    titleElem.innerHTML = (width < 500) ? "<br>&emsp;\"Alec Breton\"<br>" : "\"Alec Breton\"";
};

formatTitle();
