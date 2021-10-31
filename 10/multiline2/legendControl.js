function toggleChart(item){
    let chart2show = item.attributes['chart'].value;
    let allButtons = document.querySelector('#buttons').children;
    let allDivs = document.querySelector('div#chartContainer').children;

    for(let i = 0; i < allButtons.length; i++){
        allDivs[i].classList.remove('visible');
        allDivs[i].classList.add('invisible');
        allButtons[i].classList.add('inactive');
        allButtons[i].classList.remove('active');
        if (allButtons[i].attributes['chart'].value == chart2show){
            let div = document.querySelector(`#${chart2show}`);
            div.classList.add('visible');
            div.classList.remove('invisible');
            allButtons[i].classList.add('active');
            allButtons[i].classList.remove('inactive');

        }
    }


}