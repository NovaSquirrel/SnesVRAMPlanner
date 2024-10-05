let mapValues = {}
let layer0chrSize = 2;
let layer1chrSize = 2;
let layer2chrSize = 2;
let layer3chrSize = 2;

function refreshUsedMap() {
	let bg0size = document.getElementById("sizelayer0").value;
	let bg1size = document.getElementById("sizelayer1").value;
	let bg2size = document.getElementById("sizelayer2").value;
	let bg3size = document.getElementById("sizelayer3").value;
	let enablesprites = document.getElementById("enablesprites").checked;

	function clearCategory(category, size) {
		for(let i=0; i<size; i++) {
			document.getElementById(category + "_" + i).classList.remove("vram_used");
		}
	}
	function markCell(category, i) {
		document.getElementById(category + "_" + i).classList.add("vram_used");
	}
	function markCells(category, i, length, wrap) {
		if(i == undefined)
			return;
		while(length) {
			markCell(category, i);
			i = (i+1)%wrap;
			length--;
		}
	}

	clearCategory("vrambg0", 32);
	clearCategory("vrambg1", 32);
	clearCategory("vrambg2", 32);
	clearCategory("vrambg3", 32);
	clearCategory("vramchr0", 8);
	clearCategory("vramchr1", 8);
	clearCategory("vramchr2", 8);
	clearCategory("vramchr3", 8);
	clearCategory("spritechr", 8);

	let sizelayer0 = parseInt(document.getElementById("sizelayer0").value)
	let sizelayer1 = parseInt(document.getElementById("sizelayer1").value)
	let sizelayer2 = parseInt(document.getElementById("sizelayer2").value)
	let sizelayer3 = parseInt(document.getElementById("sizelayer3").value)

	if(bgmode == 7) {
		markCells("vrambg0", 0, 16, 32);
	} else {
		markCells("vrambg0", mapValues["vrambg0"], sizelayer0, 32);
	}
	markCells("vrambg1", mapValues["vrambg1"], sizelayer1, 32);
	markCells("vrambg2", mapValues["vrambg2"], sizelayer2, 32);
	markCells("vrambg3", mapValues["vrambg3"], sizelayer3, 32);

	if(bgmode == 7) {
		markCells("vramchr0", 0, 4, 8);
	} else {
		if(sizelayer0)
			markCells("vramchr0", mapValues["vramchr0"], layer0chrSize, 8);
	}
	if(sizelayer1)
		markCells("vramchr1", mapValues["vramchr1"], layer1chrSize, 8);
	if(sizelayer2)
		markCells("vramchr2", mapValues["vramchr2"], layer2chrSize, 8);
	if(sizelayer3)
		markCells("vramchr3", mapValues["vramchr3"], layer3chrSize, 8);

	if(enablesprites) {
		markCell("spritechr", mapValues["spritechr"]);
		markCell("spritechr", (mapValues["spritechr"] + parseInt(document.getElementById("spritegap").value)) % 8);
	}
}

function changeMap(category, index) {
	mapValues[category] = index;
	refreshUsedMap();
}

function refreshTable() {
	let output = document.getElementById("vram_table");
	// Remove all table rows except the first one
	while (output.children.length > 1) {
		output.removeChild(output.children[1]);
	}

	for(let i=0; i<32; i++) {
		function text_cell(t, category, index, rows) {
			let c = document.createElement("td");
			c.innerHTML = t;
			c.rowSpan = rows;
			c.id = category + "_" + index;
			row.append(c);
		}

		function radio_cell(category, index, rows) {
			let c = document.createElement("td");
			c.innerHTML = '<input type="radio" name="'+category+'" onclick="changeMap(\''+category+'\', '+index+')">';
			c.rowSpan = rows;
			c.id = category + "_" + index;
			row.append(c);
		}

		let row = document.createElement("tr");
		row.classList.add("results");
		output.append(row);

		text_cell((i*1024).toString(16), "address", i, 1);

		radio_cell("vrambg0", i, 1);
		radio_cell("vrambg1", i, 1);
		radio_cell("vrambg2", i, 1);
		radio_cell("vrambg3", i, 1);
		if((i % 4) == 0) {
			radio_cell("vramchr0", i/4, 4);
			radio_cell("vramchr1", i/4, 4);
			radio_cell("vramchr2", i/4, 4);
			radio_cell("vramchr3", i/4, 4);

			if((i % 8) == 0) {
				radio_cell("spritechr", i/4, 4);
			} else {
				text_cell("", "spritechr", i/4, 4);
			}
		}
	}
}

function init() {
	refreshTable();
}

let bgmode = 0;

function modeChanged() {
	bgmode = parseInt(document.getElementById("bgmode").value);

	layer0size = document.getElementById("sizelayer0");
	layer1size = document.getElementById("sizelayer1");
	layer2size = document.getElementById("sizelayer2");
	layer3size = document.getElementById("sizelayer3");
	layer0label = document.getElementById("labellayer0");
	layer1label = document.getElementById("labellayer1");
	layer2label = document.getElementById("labellayer2");
	layer3label = document.getElementById("labellayer3");

	layer0size.disabled = true;
	layer1size.disabled = true;
	layer2size.disabled = true;
	layer3size.disabled = true;
	layer0label.innerText = "Layer 0: N/A";
	layer1label.innerText = "Layer 1: N/A";
	layer2label.innerText = "Layer 2: N/A";
	layer3label.innerText = "Layer 3: N/A";
	layer0chrSize = 0;
	layer1chrSize = 0;
	layer2chrSize = 0;
	layer3chrSize = 0;

	switch(bgmode) {
		case 0:
			layer0size.disabled = false;
			layer1size.disabled = false;
			layer2size.disabled = false;
			layer3size.disabled = false;
			layer0label.innerText = "Layer 0: 4-color";
			layer1label.innerText = "Layer 1: 4-color";
			layer2label.innerText = "Layer 2: 4-color";
			layer3label.innerText = "Layer 3: 4-color";
			layer0chrSize = 2;
			layer1chrSize = 2;
			layer2chrSize = 2;
			layer3chrSize = 2;
			break;
		case 1:
			layer0size.disabled = false;
			layer1size.disabled = false;
			layer2size.disabled = false;
			layer0label.innerText = "Layer 0: 16-color";
			layer1label.innerText = "Layer 1: 16-color";
			layer2label.innerText = "Layer 2: 4-color";
			document.getElementById("sizelayer3").selectedIndex = 0;
			layer0chrSize = 4;
			layer1chrSize = 4;
			layer2chrSize = 2;
			break;
		case 2:
			layer0size.disabled = false;
			layer1size.disabled = false;
			layer2size.disabled = false;
			layer0label.innerText = "Layer 0: 16-color";
			layer1label.innerText = "Layer 1: 16-color";
			layer2label.innerText = "Layer 2: offset-per-tile";
			document.getElementById("sizelayer3").selectedIndex = 0;
			layer0chrSize = 4;
			layer1chrSize = 4;
			break;
		case 3:
			layer0size.disabled = false;
			layer1size.disabled = false;
			layer0label.innerText = "Layer 0: 256-color";
			layer1label.innerText = "Layer 1: 16-color";
			document.getElementById("sizelayer2").selectedIndex = 0;
			document.getElementById("sizelayer3").selectedIndex = 0;
			layer0chrSize = 8;
			layer1chrSize = 4;
			break;
		case 4:
			layer0size.disabled = false;
			layer1size.disabled = false;
			layer2size.disabled = false;
			layer0label.innerText = "Layer 0: 256-color";
			layer1label.innerText = "Layer 1: 4-color";
			layer2label.innerText = "Layer 2: offset-per-tile";
			document.getElementById("sizelayer3").selectedIndex = 0;
			layer0chrSize = 8;
			layer1chrSize = 2;
			break;
		case 5:
			layer0size.disabled = false;
			layer1size.disabled = false;
			layer0label.innerText = "Layer 0: 16-color";
			layer1label.innerText = "Layer 1: 4-color";
			document.getElementById("sizelayer2").selectedIndex = 0;
			document.getElementById("sizelayer3").selectedIndex = 0;
			layer0chrSize = 4;
			layer1chrSize = 2;
 			break;
		case 6:
			layer0size.disabled = false;
			layer2size.disabled = false;
			layer0label.innerText = "Layer 0: 16-color";
			layer2label.innerText = "Layer 2: offset-per-tile";
			document.getElementById("sizelayer1").selectedIndex = 0;
			document.getElementById("sizelayer3").selectedIndex = 0;
			layer0chrSize = 4;
			break;
		case 7:
			layer0size.disabled = false;
			layer0label.innerText = "Layer 0: 256-color";
			document.getElementById("sizelayer1").selectedIndex = 0;
			document.getElementById("sizelayer2").selectedIndex = 0;
			document.getElementById("sizelayer3").selectedIndex = 0;
			// CHR size overridden
			break;
	}

	if(bgmode == 7) {
		document.getElementById("sizelayer0_1").disabled = true;
		document.getElementById("sizelayer0_2").disabled = true;
		document.getElementById("sizelayer0_3").disabled = true;
		document.getElementById("sizelayer0_4").disabled = true;
		document.getElementById("sizelayer0_5").disabled = false;
		if(document.getElementById("sizelayer0").selectedIndex != 5) {
			document.getElementById("sizelayer0").selectedIndex = 5;
		}
	} else {
		document.getElementById("sizelayer0_1").disabled = false;
		document.getElementById("sizelayer0_2").disabled = false;
		document.getElementById("sizelayer0_3").disabled = false;
		document.getElementById("sizelayer0_4").disabled = false;
		document.getElementById("sizelayer0_5").disabled = true;
		if(document.getElementById("sizelayer0").selectedIndex == 5) {
			document.getElementById("sizelayer0").selectedIndex = 1;
		}
	}
	refreshUsedMap();
}
