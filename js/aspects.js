graph = {};
			function connect(aspect1, aspect2) {
				function addConnection(from, to) {
					if (!(from in graph)) graph[from] = [];
					graph[from].push(to);
				}
				addConnection(aspect1, aspect2);
				addConnection(aspect2, aspect1);
			}

			function output(path) {
				var output = [];
				path.forEach(function(e) {
					output.push(translate[e] + " (" + e + ")");
				});
				return output.join(" -> ");
			}

			function find(from, to, steps) {
				function search(queue, to, visited) {
					while (!queue.isEmpty()) {
						var element = queue.dequeue();
						//alert("path: " + element.path + "\nqueue: " + debug(queue));
						var node = element.path.pop();
						if (!(node in visited) || visited[node].indexOf(element.path.length) < 0) {
							element.path.push(node);
							if (node == to && element.path.length > steps + 1) return element.path;
							graph[node].forEach(function(entry) {
								var newpath = element.path.slice();
								newpath.push(entry);
								queue.enqueue({"path":newpath,"length":element.length+getWeight(entry)});
							});
							if (!(node in visited)) visited[node] = [];
							visited[node].push(element.path.length-1);
						}
					}
					return null;
				}

				var queue = new buckets.PriorityQueue(function(a,b) {
					return b.length-a.length;
				});
				queue.enqueue({"path":[from],"length":0});
				visited = {};
				//alert("visited: " + visited + "\nqueue: " + debug(queue));
				return search(queue, to, visited);
			}
			
			combinations = { "void": ["air", "entropy"], "light": ["air", "fire"], "energy": ["order", "fire"], "motion": ["air", "water"], "stone": ["earth", "earth"], "life": ["water", "earth"], "weather": ["air", "ice"], "ice": ["water", "order"], "crystal": ["stone", "water"], "death": ["life", "entropy"], "flight": ["air", "motion"], "darkness": ["void", "light"], "soul": ["life", "death"], "heal": ["life", "life"], "travel": ["motion", "earth"], "poison": ["water", "death"], "eldritch": ["void", "darkness"], "magic": ["void", "energy"], "aura": ["magic", "air"], "taint": ["magic", "entropy"], "seed": ["life", "order"], "slime": ["life", "water"], "plant": ["seed", "earth"], "tree": ["air", "plant"], "beast": ["motion", "life"], "flesh": ["death", "beast"], "undead": ["motion", "death"], "mind": ["earth", "soul"], "senses": ["air", "soul"], "man": ["beast", "mind"], "crop": ["plant", "man"], "harvest": ["crop", "tool"], "metal": ["stone", "order"], "mine": ["man", "stone"], "tool": ["man", "order"], "weapon": ["tool", "entropy"], "armor": ["tool", "earth"], "hunger": ["life", "void"], "greed": ["man", "hunger"], "craft": ["man", "tool"], "cloth": ["tool", "beast"], "mechanism": ["motion", "tool"], "trap": ["motion", "entropy"], "exchange": ["motion", "water"], "wrath": ["weapon", "fire"], "nether": ["fire", "magic"], "gluttony": ["hunger", "hunger"], "envy": ["senses", "hunger"], "sloth": ["trap", "soul"], "pride": ["flight", "void"], "lust": ["flesh", "hunger"], "time": ["void", "order"] };
			translate = { "air": "aer", "earth": "terra", "fire": "ignis", "water": "aqua", "order": "ordo", "entropy": "perditio", "void": "vacuos", "light": "lux", "energy": "potentia", "motion": "motus", "stone": "saxum", "life": "victus", "weather": "tempestas", "ice": "gelum", "crystal": "vitreus", "death": "mortuus", "flight": "volatus", "darkness": "tenebrae", "soul": "spiritus", "heal": "sano", "travel": "iter", "poison": "venenum", "eldritch": "alienis", "magic": "praecantatio", "aura": "auram", "taint": "vitium", "seed": "granum", "slime": "limus", "plant": "herba", "tree": "arbor", "beast": "bestia", "flesh": "corpus", "undead": "exanimis", "mind": "cognitio", "senses": "sensus", "man": "humanus", "crop": "messis", "harvest": "meto", "metal": "metallum", "mine": "perfodio", "tool": "instrumentum", "weapon": "telum", "armor": "tutamen", "hunger": "fames", "greed": "lucrum", "craft": "fabrico", "cloth": "pannus", "mechanism": "machina", "trap": "vinculum", "exchange": "permutatio", "wrath": "ira", "nether": "infernus", "gluttony": "gula", "envy": "invidia", "sloth": "desidia", "pride": "superbia", "lust": "luxuria", "time": "tempus" };
			aspects = [ "air", "earth", "fire", "water", "order", "entropy", "void", "light", "energy", "motion", "stone", "life", "weather", "ice", "crystal", "death", "flight", "darkness", "soul", "heal", "travel", "poison", "eldritch", "magic", "aura", "taint", "seed", "slime", "plant", "tree", "beast", "flesh", "undead", "mind", "senses", "man", "crop", "harvest", "metal", "mine", "tool", "weapon", "armor", "hunger", "greed", "craft", "cloth", "mechanism", "trap", "exchange", "wrath", "nether", "gluttony", "envy", "sloth", "pride", "lust", "time" ].sort(function(a,b){
				return (a == b) ? 0 : (translate[a]<translate[b]) ? -1 : 1;
			});
			fm = [ "wrath", "nether", "gluttony", "envy", "sloth", "pride", "lust" ]
			mb = [ "time" ];

			for (compound in combinations) {
				connect(compound, combinations[compound][0]);
				connect(compound, combinations[compound][1]);
			}

			function toggle(obj) {
				$(obj).find("img").attr("src", function(i,orig){ return (orig.indexOf("color") < 0) ? orig.replace(/mono/, "color") : orig.replace(/color/, "mono"); });
				$(obj).toggleClass("unavail");
			}

			window.onload = function() {
				function option(value, text) {
					var option = document.createElement("option");
					option.value = value;
					option.textContent = text;
					return option;
				}

				fromSel = document.getElementById("fromSel");
				toSel = document.getElementById("toSel");
				//stepSel = document.getElementById("steps");
				check = document.getElementById("available");
				var i = 0;
				aspects.forEach(function(aspect) {
					if (fm.indexOf(aspect) < 0 && mb.indexOf(aspect) < 0) {
						$('#avail').append('<li><a onclick="toggle(this)" id="check' + aspect + '"><img src="aspects/color/' + translate[aspect] + '.png" /><div>' + translate[aspect] + '</div><div class="desc">' + aspect + '</div></a></li>');
					} else {
						$('#avail').append('<li><a onclick="toggle(this)" id="check' + aspect + '" class="unavail"><img src="aspects/mono/' + translate[aspect] + '.png" /><div>' + translate[aspect] + '</div><div class="desc">' + aspect + '</div></a></li>');
					}
				});
				//$('#available').buttonset();
				// for (var i=0; i<11; i++) {
				// 	stepSel.appendChild(option(i, "" + i));
				// }
				var ddData = [];
				aspects.forEach(function(aspect) {
					ddData.push({text: translate[aspect], value: aspect, description: "(" + aspect + ")", imageSrc: "aspects/color/" + translate[aspect] + ".png"});
				});
				$('#fromSel').ddslick({
					data: ddData,
					defaultSelectedIndex: 0,
					height: 300,
					width: 170
				});
				$('#toSel').ddslick({
					data: ddData,
					defaultSelectedIndex: 0,
					height: 300,
					width: 170
				});
				steps = $("#spinner").spinner({
					min: 0,
					max: 10
				});
				$("#result").dialog({
					autoOpen: false,
					modal: false,
					width: 200
				});
				$('#fm').click(function() {
					if (this.checked) {
						fm.forEach(function(e){
							var obj = $('#check'+e);
							obj.find("img").attr("src", function(i,orig){ return orig.replace(/mono/, "color"); });
							obj.removeClass("unavail");
						});
					} else {
						fm.forEach(function(e){
							var obj = $('#check'+e);
							obj.find("img").attr("src", function(i,orig){ return orig.replace(/color/, "mono"); });
							obj.addClass("unavail");
						});
					}
				});
				$('#mb').click(function() {
					if (this.checked) {
						mb.forEach(function(e){
							var obj = $('#check'+e);
							obj.find("img").attr("src", function(i,orig){ return orig.replace(/mono/, "color"); });
							obj.removeClass("unavail");
						});
					} else {
						mb.forEach(function(e){
							var obj = $('#check'+e);
							obj.find("img").attr("src", function(i,orig){ return orig.replace(/color/, "mono"); });
							obj.addClass("unavail");
						});
					}
				});
			};
			function run() {
				var path = find($('#fromSel').data('ddslick').selectedData.value, $('#toSel').data('ddslick').selectedData.value, steps.spinner("value"));
				$('#result').empty();
				path.forEach(function(e) {
					$('#result').append('<li><img src="aspects/color/' + translate[e] + '.png" /><div>' + translate[e] + '</div><div class="desc">' + e + '</div></li><li>↓</li>');
				});
				$('#result').children().last().remove();
				$('#result').dialog("open");
			}

			function getWeight(aspect) {
				var el = $("#check" + aspect);
				return (el.hasClass("unavail")) ? 100 : 1;
			}