'use strict';

const Bowser = require("bowser");

export default function (config) {

	let defaultConfig = {
		bodyClass : false,
		browserVersion : 2,
		osVersion : 1
	}

	let browserVersion = {
		"chrome" : 91,
		"firefox" : {
			"desktop": 89,
			"mobile": 34
		},
		"edge" : {
			"desktop": 91,
			"mobile": 46
		},
		"opera" : {
			"desktop": 76,
			"mobile": 63
		},
		"ie" : 11,
		"safari" : 14
	}

	let osVersion = {
		"windows" : 10,
		"android" : 11,
		"ios" : 14,
		"macos" : 11,
		"chromeos" : 91
	}

	config = {...defaultConfig, ...config};

	function isCanvasSupported(){
		try {
			let canvas = document.createElement('canvas');
			return !!(canvas.getContext && canvas.getContext('2d'));
		} catch(e) {
			return false;
		}
	}

	function isWebGLSupported () {
		try {
			let canvas = document.createElement('canvas');
			return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
		} catch(e) {
			return false;
		}
	}

	function detectPowerMode () {

		let videoElement = document.createElement('video');

		videoElement.src = 'data:video/mp4;base64,'+video_base64;
		videoElement.width = 1;
		videoElement.height = 1;
		videoElement.autoplay = true;
		videoElement.muted = true;
		videoElement.style = 'position:fixed;left:0;top:0;z-index:99999';

		document.body.appendChild(videoElement);

		videoElement.addEventListener('play', () => {
			system.powermode = false;
			systemChanged()
		});

		setTimeout(function (){ document.body.removeChild(videoElement) }, 1000)
	}

	function computeCPUScore(timeFrame) {

		let sysm = 0;

		let start = new Date().getTime();
		let end   = start;

		while (end - start === 0) {
			end = new Date().getTime();
		}

		start = end;

		while (end - start < timeFrame) {
			sysm++;
			end = new Date().getTime();
		}

		return sysm;
	}

	function addBodyClass(){

		if( config.bodyClass ){

			document.body.classList.add(system.platform);

			document.body.classList.add(system.browser.name);
			if( system.browser.version )
				document.body.classList.add(system.browser.name+'-'+system.browser.version);

			document.body.classList.add(system.os.name);
			if( system.os.version )
				document.body.classList.add(system.os.name+'-'+system.os.version);

			document.body.classList.add(system.touch ? 'touch' : 'no-touch');
		}
	}

	function computeGrade(){

		let score = 8;

		if( system.browser && system.browser.uptodate === false )
			score--;

		if( system.platform === 'mobile' )
			score--;

		if( system.os && system.os.uptodate === false )
			score--;

		if( (system.battery && system.battery.level < 0.2 && !system.battery.charging) || system.powermode )
			score--;

		if( system.memory && system.memory < 4 )
			score--;

		if( (system.cpu.core && system.cpu.core < 4) || system.cpu.score < 10000 )
			score--;

		if( system.cpu.effectiveType && system.cpu.effectiveType !== "4g" && system.cpu.effectiveType !== "wifi" )
			score--;

		if( system.browser.name === 'explorer' )
			score--;

		system.score = Math.round((score/8)*10);

		let grade = 'A';

		if( system.score <= 2 )
			grade = 'E';
		else if( system.score <= 4 )
			grade = 'D';
		else if( system.score <= 6 )
			grade = 'C';
		else if( system.score <= 8 )
			grade = 'B';

		if( config.bodyClass ){

			if( grade !== system.grade && system.grade )
				document.body.classList.remove('grade-'+system.grade);

			document.body.classList.add('grade-'+grade);
		}

		system.grade = grade;
	}

	function systemChanged(){

		computeGrade();

		const event = new CustomEvent('systemchange', {detail:system});
		window.dispatchEvent(event);
	}

	const bowser = Bowser.getParser(window.navigator.userAgent);

	let video_base64 = "AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAAr9tZGF0AAACoAYF//+c3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDEyNSAtIEguMjY0L01QRUctNCBBVkMgY29kZWMgLSBDb3B5bGVmdCAyMDAzLTIwMTIgLSBodHRwOi8vd3d3LnZpZGVvbGFuLm9yZy94MjY0Lmh0bWwgLSBvcHRpb25zOiBjYWJhYz0xIHJlZj0zIGRlYmxvY2s9MTowOjAgYW5hbHlzZT0weDM6MHgxMTMgbWU9aGV4IHN1Ym1lPTcgcHN5PTEgcHN5X3JkPTEuMDA6MC4wMCBtaXhlZF9yZWY9MSBtZV9yYW5nZT0xNiBjaHJvbWFfbWU9MSB0cmVsbGlzPTEgOHg4ZGN0PTEgY3FtPTAgZGVhZHpvbmU9MjEsMTEgZmFzdF9wc2tpcD0xIGNocm9tYV9xcF9vZmZzZXQ9LTIgdGhyZWFkcz02IGxvb2thaGVhZF90aHJlYWRzPTEgc2xpY2VkX3RocmVhZHM9MCBucj0wIGRlY2ltYXRlPTEgaW50ZXJsYWNlZD0wIGJsdXJheV9jb21wYXQ9MCBjb25zdHJhaW5lZF9pbnRyYT0wIGJmcmFtZXM9MyBiX3B5cmFtaWQ9MiBiX2FkYXB0PTEgYl9iaWFzPTAgZGlyZWN0PTEgd2VpZ2h0Yj0xIG9wZW5fZ29wPTAgd2VpZ2h0cD0yIGtleWludD0yNTAga2V5aW50X21pbj0yNCBzY2VuZWN1dD00MCBpbnRyYV9yZWZyZXNoPTAgcmNfbG9va2FoZWFkPTQwIHJjPWNyZiBtYnRyZWU9MSBjcmY9MjMuMCBxY29tcD0wLjYwIHFwbWluPTAgcXBtYXg9NjkgcXBzdGVwPTQgaXBfcmF0aW89MS40MCBhcT0xOjEuMDAAgAAAAA9liIQAV/0TAAYdeBTXzg8AAALvbW9vdgAAAGxtdmhkAAAAAAAAAAAAAAAAAAAD6AAAACoAAQAAAQAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAhl0cmFrAAAAXHRraGQAAAAPAAAAAAAAAAAAAAABAAAAAAAAACoAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAgAAAAIAAAAAAAkZWR0cwAAABxlbHN0AAAAAAAAAAEAAAAqAAAAAAABAAAAAAGRbWRpYQAAACBtZGhkAAAAAAAAAAAAAAAAAAAwAAAAAgBVxAAAAAAALWhkbHIAAAAAAAAAAHZpZGUAAAAAAAAAAAAAAABWaWRlb0hhbmRsZXIAAAABPG1pbmYAAAAUdm1oZAAAAAEAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAAAPxzdGJsAAAAmHN0c2QAAAAAAAAAAQAAAIhhdmMxAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAgACABIAAAASAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGP//AAAAMmF2Y0MBZAAK/+EAGWdkAAqs2V+WXAWyAAADAAIAAAMAYB4kSywBAAZo6+PLIsAAAAAYc3R0cwAAAAAAAAABAAAAAQAAAgAAAAAcc3RzYwAAAAAAAAABAAAAAQAAAAEAAAABAAAAFHN0c3oAAAAAAAACtwAAAAEAAAAUc3RjbwAAAAAAAAABAAAAMAAAAGJ1ZHRhAAAAWm1ldGEAAAAAAAAAIWhkbHIAAAAAAAAAAG1kaXJhcHBsAAAAAAAAAAAAAAAALWlsc3QAAAAlqXRvbwAAAB1kYXRhAAAAAQAAAABMYXZmNTQuNjMuMTA0";

	let system = {
		connection : false,
		powermode : true,
		grade : false,
		touch : false
	};

	if (!navigator){

		console.error('Browser not supported');
		return;
	}

	system.touch = 'ontouchstart' in window || navigator.msMaxTouchPoints || false;

	detectPowerMode();

	system.browser = {
		name: bowser.getBrowserName(true).replace('microsoft ',''),
		version: bowser.getBrowserVersion()?parseFloat(bowser.getBrowserVersion()):null,
		uptodate: null,
		features: {
			canvas : isCanvasSupported(),
			webgl : isWebGLSupported()
		}
	}

	if( system.browser.name in browserVersion ){

		let version = browserVersion[system.browser.name];

		if( typeof version === 'object' )
			version = version[system.platform];

		version = version - config.browserVersion;

		system.browser.uptodate = system.browser.version >= version;
	}

	system.memory = navigator.deviceMemory;

	system.cpu = {
		core: navigator.hardwareConcurrency,
		score: computeCPUScore(20)
	};

	system.screen = {
		width : window.screen.width,
		height : window.screen.height,
		pixelRatio : window.devicePixelRatio
	};

	system.os = {
		name: bowser.getOSName(true),
		uptodate: null,
		version: bowser.getOSVersion()?parseFloat(bowser.getOSVersion().replace(/[^\d.-]/g, '')):null,
	}

	if( system.os === 'windows'){

		if( system.version === 6.3 )
			system.version = 9;
		else if( system.version === 6.2 )
			system.version = 8;
		else if( system.version === 6.1 )
			system.version = 7;
	}

	if( system.os.name in osVersion ){

		let version = osVersion[system.os.name];

		version = version - config.osVersion;

		system.os.uptodate = system.os.version >= version;
	}

	if( 'connection' in navigator ){

		system.connection = {
			type: navigator.connection.type,
			effectiveType: navigator.connection.effectiveType
		}

		navigator.connection.addEventListener('change', function() {

			system.connection = {
				type: navigator.connection.type,
				effectiveType: navigator.connection.effectiveType
			}

			systemChanged();
		});
	}

	system.platform = bowser.getPlatformType(true)
	system.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	if (typeof navigator.getBattery === "function") {

		navigator.getBattery().then(function (battery) {

			system.battery = {
				level: battery.level,
				charging: battery.charging
			}

			systemChanged();

			battery.addEventListener('chargingchange', function (e) {

				system.battery = {
					level: battery.level,
					charging: battery.charging
				}

				systemChanged();
			});
		});
	}

	addBodyClass();
	systemChanged();

	return system;
}
