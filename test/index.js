'use strict';
import detect from '../index';

window.addEventListener('systemchange',function (e){

	document.getElementById('info').innerHTML = JSON.stringify(e.detail, null, 2);
})

let system = detect({bodyClass:true});
console.log(system)
