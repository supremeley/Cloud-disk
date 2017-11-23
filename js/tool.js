var handel = {
	maxid: data.length,
	now:1,
	cutid:[],
	copyid:[],
	getByid:function(id){
		return data.filter(function(a){
			return a.id == id;
		})[0];
	},
	getByPid:function(pid){
		return data.filter(function(a){
			return a.pid == pid;
		});
	},
	formHtmlByPid:function(pid,padL){
		var str="";
		var paddingLeft = padL;
		var d = this.getByPid(pid);
		for(var i = 0; i<d.length ;i++){
			var temp = this.getByPid(d[i].id);
			if(temp.length == 0){
				str += `<li><h3 idnum='${d[i].id}'class='bingpai' style='padding-left:${paddingLeft}px'><span class='jiantou zhanwei'></span><span class='dakai'></span>${d[i].name}</h3></li>`;
			}else{
				var a = paddingLeft + 20;
				str += "<li><h3 idnum='"+d[i].id+"'class='bingpai' style='padding-left:"+paddingLeft+"px'><span class='jiantou'></span><span class='dakai'></span>"+d[i].name+"</h3><ul class='ulyincang'>"+this.formHtmlByPid(d[i].id,a)+"</ul></li>"
			}
		}
		return str;
	},
	createleft:function(){
		if(this.getByPid(0).length == 0 ){
			return
		}
		document.querySelector('.pad').innerHTML = this.formHtmlByPid(0,20);
		this.leftclick();
	},
	leftclick:function(){
		var h3 = document.querySelectorAll('.pad h3');
		
		for(var i=0 ; i<h3.length ; i++){
			h3[i].onclick = function(){
				var idnum = this.getAttribute('idnum');
					handel.createNav(idnum);
					handel.createfolder(idnum);
					handel.now = idnum;	
					return false;
			};

			if(h3[i].nextElementSibling){//筛选出存在兄弟的h3
				
				var jiantou = h3[i].querySelectorAll('.jiantou');

				for(var j=0;j<jiantou.length;j++){
					jiantou[j].onclick = function(e){//为箭头添加点击事件
						e.cancelBubble = true;//阻止冒泡
						if( this.classList.contains("jiantou") ){
							this.parentNode.nextElementSibling.querySelectorAll("span[class~='xuanzhuan']").forEach(function(item){
								item.classList.remove("xuanzhuan");
								if(item.parentNode.nextElementSibling){
									item.parentNode.nextElementSibling.classList.add("ulyincang");
								}
							})
						}
						this.classList.toggle("xuanzhuan");
						this.parentNode.nextElementSibling.classList.toggle("ulyincang");
					}
				}
			}	
		}
	},
	createNav:function(idnum){
		var arr = [];

		add(idnum);

		function add(idnum){
			arr.unshift({
				"name":handel.getByid(idnum).name,
				"id":handel.getByid(idnum).id
			});
			if(handel.getByid(handel.getByid(idnum).pid)){
				add(handel.getByid(idnum).pid);
			};
		}
		var str = arr.map(function(item){
			return "<div idnum='"+item.id+"'>"+item.name+"</div>";
		}).join("<span></span>");

		var conheaderlist = document.getElementById('conheaderlist');
		conheaderlist.innerHTML = str;

		var divs = document.querySelectorAll("#conheaderlist div");

		divs.forEach(function(item){
			item.onclick = function(){
				var idnum = this.getAttribute('idnum');
				handel.createNav(idnum);
				handel.createfolder(idnum);
				handel.now = idnum;
			}
		})
	},
	createfolder:function(idnum){
		var arr = data.filter(function(item){
			return item.pid == idnum;
		});
		var str = "";
		arr.forEach(function(item){
			str += "<div class='box' idnum='"+item.id+"'><div class='boxinp'></div><div class='boximg'></div><div class='boxname'>"+item.name+"</div><input class='boxchange' type='text'></div>";
		})
		var coninner = document.getElementById('coninner');
		coninner.innerHTML = str;
		coninner.style.background = "#f4f5fa";
		if(str == ""){
			coninner.style.background = "#f4f5fa url(img/emptybg.png) no-repeat center center";
		}

		var box = document.querySelectorAll('#coninner .box');
		var boxactive = document.querySelectorAll('#coninner .active');
		box.forEach(function(item){
			item.ondblclick = function(){
				var idnum = this.getAttribute('idnum');
				handel.createfolder(idnum);
				handel.createNav(idnum);
				handel.lefttree(idnum);
				handel.now = idnum;
			};

			item.onmousedown = function(ev){
				if(!ev.ctrlKey){
					if(ev.button == 0){
						var that = this;
						document.querySelectorAll('#coninner .box').forEach(function(item){
							if( item != that){//
								item.classList.remove('active');
							}
						})
						this.classList.add('active');
					}
				}else{
					this.classList.toggle('active');
				}
				handel.all();
			};

			item.addEventListener('mousedown',function(ev){ 
				if(ev.button == 2){
					var that = this;
					var boxactive = document.querySelectorAll('#coninner .active');
					var box = document.querySelectorAll('#coninner .box');

					if(!ev.target.classList.contains('active') && !ev.target.parentNode.classList.contains('active')){
						// console.log(boxactive)
						box.forEach(function(item){
							item.classList.remove('active');
						})
						that.classList.add('active');
					}
					// console.log(ev.target.parentNode)
					var rightlist = document.getElementById('rightlist');
					var wrap = document.getElementById('wrap');
					var loc = {'x':wrap.offsetLeft,'y':wrap.offsetTop};
					rightlist.className = "eshow";

					if(ev.clientY-loc.y > 430){
						rightlist.style.top = "430px";
					}else{
						rightlist.style.top = ev.clientY-loc.y + "px";
					}

					if(ev.clientX-loc.x > 1048){
						rightlist.style.left = "1048px";
					}else{
						rightlist.style.left = ev.clientX-loc.x + "px";	
					}

					handel.rightfun();

					var allcheck = document.querySelector('#conheader #checkbox');

					handel.all();
				}
				return false;
			});

			item.children[3].onblur = function(){
				var lastname = item.children[2].innerHTML;
				var newname = item.children[3].value;
				var thispid = handel.getByid(item.getAttribute('idnum'));
				if(newname.length == 0){
					alert("请输入文件名");
					item.children[3].value = lastname;
					item.children[3].focus();
				}
				if(handel.checkName(thispid.id,newname,thispid.pid)){
					alert("本文件夹已有重复名的文件");
					// item.children[3].focus();
				}else{
					item.classList.remove('edit');
					item.querySelector('.boxname').innerHTML = item.children[3].value;
					thispid.name = newname;
					handel.createleft();
					handel.lefttree(thispid.pid);
				}
			}
		})
	},
	changename:function(){
		var changebox = document.querySelectorAll('.active')[0];
		if(changebox){
			var oldname = changebox.children[2].innerHTML;
			changebox.classList.add('edit');
			changebox.children[3].focus();
			changebox.children[3].value = oldname;
			document.onkeydown = function(ev){
				if(ev.keyCode == 13){
					changebox.classList.remove('edit');
					changebox.children[2].innerHTML = changebox.children[3].value;
				}
			}
		}else{
			alert('请选择目标文件');
		}
	},
	F2:function(){
		document.addEventListener('keydown',function(ev){
			if(ev.keyCode == 113){
				handel.changename();
			}
		})
	},
	lefttree:function(nowid){
		changeleft(nowid);
		function changeleft(nowid){
			var now = document.querySelectorAll('.pad h3[idnum = "'+ nowid +'"]')[0];
			if(now.children[0].classList.contains('jiantou')){
				now.children[0].classList.add('xuanzhuan');
				if(now.nextElementSibling){
					now.nextElementSibling.classList.remove('ulyincang');
				}
			}
			if( handel.getByid( handel.getByid( nowid ).pid)){
				handel.lefttree( handel.getByid( nowid ).pid);
			}
		}
	},
	checkName:function(id,newName,pid){
		var nowTemp = handel.getByPid(pid).filter(function(item){
			return item.id != id;
		});
		return nowTemp.some(function(item){
			return item.name == newName;
		});
	},
	addDocumentEvent:function(){
		document.onclick = function(ev){
			if(ev.target.id == "coninner"){
				document.querySelectorAll('#coninner .active').forEach(function(item){
					item.classList.remove("active");
				})
				var allcheck = document.querySelector('#conheader #checkbox');
				allcheck.checked = false;
			}
		};
		var coninner = document.getElementById('coninner');
		coninner.onmousedown = function(ev){
			if ( ev.target.id == "coninner"){
				var checksquare = document.createElement("div");
				checksquare.className = "square";
				coninner.appendChild(checksquare);
				var squareori = {
					"x":ev.clientX,
					"y":ev.clientY
				};
				document.onmousemove = function(ev){
					var sleft = Math.min(ev.clientX-coninner.getBoundingClientRect().left,squareori.x-coninner.getBoundingClientRect().left);
					var stop = Math.min(ev.clientY-coninner.getBoundingClientRect().top,squareori.y-coninner.getBoundingClientRect().top);
					checksquare.style.left = sleft+"px";
					checksquare.style.top = stop+"px";
					checksquare.style.width = Math.abs(ev.clientX - squareori.x)+"px";
					checksquare.style.height = Math.abs(ev.clientY - squareori.y)+"px";

					var boxs = coninner.querySelectorAll('#coninner .box');

					boxs.forEach(function(item){
						var bpos = item.getBoundingClientRect();
						var spos = checksquare.getBoundingClientRect();
						if(bpos.left > spos.right || bpos.right < spos.left || bpos.top > spos.bottom || bpos.bottom < spos.top){
							item.classList.remove( "active" );
						}else{
							item.classList.add( "active" );
						}
					})
					handel.all();
					return false;
				};
				document.onmouseup = function(){
					coninner.removeChild(checksquare);
					
					document.onmousemove = document.onmouseup = null;
				}
			}else if( ev.target.classList.contains('active') || ev.target.parentNode.classList.contains('active')){
				var movelist = document.createElement('div');
				movelist.className = "mlist";

				var bm = document.querySelectorAll('#coninner .active');
				movelist.innerHTML = bm.length+"<span class='num'></span>";
				document.onmousemove = function(ev){
					coninner.appendChild(movelist);
					movelist.style.left = ev.clientX-coninner.getBoundingClientRect().left-50+"px";
					movelist.style.top = ev.clientY-coninner.getBoundingClientRect().top-50+"px";
					var mboxs = document.querySelectorAll('#coninner .box:not(.active)');
					mboxs.forEach(function(item){
						var mbpos = item.getBoundingClientRect();
						if(mbpos.left < ev.clientX && mbpos.right> ev.clientX && mbpos.top < ev.clientY&& mbpos.bottom > ev.clientY ){
							item.classList.add('gointo');
						}else{
							item.classList.remove('gointo');
						}
					})
					return false;
				};

				document.onmouseup = function(){
					var into = document.querySelector('#coninner .gointo');
					if(into){
						var intoid = into.getAttribute('idnum');
						var intoall = Array.from(handel.getByPid(intoid)).map(function(item){
							return item.name;
						});
						var bmname = Array.from(bm).map(function(item){
							return item.children[2].innerHTML;
						});
						if(intoall.concat(bmname).length == new Set(intoall.concat(bmname)).size ){
							Array.from(bm).map(function(item){
								return handel.getByid(item.getAttribute('idnum'))
							}).forEach(function(item){
								item.pid = intoid;
							})
							handel.createfolder(handel.now);
							handel.createleft();
							handel.lefttree(handel.now);
						}else{
							alert("目标文件夹和要移动的文件夹有重复名")
							coninner.removeChild(movelist);
						}
					}else{
						if(document.querySelector('.mlist')){
							coninner.removeChild(movelist);
						}
					};
					document.onmousemove = document.onmouseup = null;
				}
			}
		}
	},
	addFolder:function(){
		handel.maxid++;
 		var newTemp = {
 			"id":handel.maxid,
 			"name":"新建文件夹",
 			"pid":handel.now,
 			"type":"delFolder"
 		};
 		data.push(newTemp);
 		handel.createfolder( handel.now );
 		handel.createleft(handel.now);
 		handel.lefttree( handel.now );

 		var box = document.getElementById('coninner').children;
 		box[box.length-1].className += " edit";
 		box[box.length-1].children[3].value = "新建文件夹";
 		box[box.length-1].children[3].focus();
	},
	delFolder:function(){
		var delFolder = document.querySelectorAll('#coninner .active');
		// console.log(delFolder)
		if(delFolder.length != 0 ){
			var delid = [];
			delFolder.forEach(function(item){
				delid.push(item.getAttribute('idnum'));
				item.parentNode.removeChild(item);
			});

			var relationid = [];

			delid.forEach(function(item){
				var h3 = document.querySelectorAll(`.pad h3[idnum="${item}"]`);
				h3.forEach(function(item){
					if(item.nextElementSibling){
						relationid = relationid.concat(Array.from(item.nextElementSibling.querySelectorAll("h3")).map(function(item){
							return item.getAttribute('idnum');
						}));
						item.parentNode.removeChild(item.nextElementSibling);
					}
					item.parentNode.removeChild(item);
				})
			})

			delid = delid.concat(relationid);

			data = data.filter(function(item){
				return delid.indexOf(item.id+"") == -1;
			})
			handel.createfolder(handel.now);
			handel.createleft();
			handel.lefttree(handel.now);
		}else{
			alert('请选择目标文件')
		};
	},
	rightbutton:function(){
		var rightlist = document.getElementById('rightlist');
		var wrap = document.getElementById('wrap');
		var loc = {'x':wrap.offsetLeft,'y':wrap.offsetTop};
		var allcheck = document.querySelector('#conheader #checkbox');
		document.onmousedown = function(ev){
			if(ev.button == 2){
				if( ev.target.id =="coninner"){
					rightlist.className = "show";

					if(ev.clientY-loc.y > 430){
						rightlist.style.top = "430px";
					}else{
						rightlist.style.top = ev.clientY-loc.y + "px";
					}

					if(ev.clientX-loc.x > 1048){
						rightlist.style.left = "1048px";
					}else{
						rightlist.style.left = ev.clientX-loc.x + "px";	
					}

					var box = document.querySelectorAll('.box');
					if(box.length!=0){
						box.forEach(function(item){
							item.classList.remove('active');
						})
					}
				}
				handel.all();
				handel.rightfun();
			}
			if(ev.button == 0){
				if(ev.target.id){
					if(ev.target.parentNode.id != "rightlist" && ev.target.id != "rightlist"){
						rightlist.className = "";
					}
				}
			}
		}
	},
	rightfun:function(){
		var create = document.querySelector('#rightlist .create');
		var rightlist = document.getElementById('rightlist');
		create.onclick = function(){
			handel.addFolder();
			rightlist.className = "";
		}

		var del = document.querySelector('.eshow .del');
		if(del){
			del.onclick = function(){
				if(this.parentNode.classList.contains('eshow')){
					handel.delFolder();
					rightlist.className = "";
				}
			}
		}

		var chongmingm = document.querySelector('.eshow .chongmingm');
		if(chongmingm){
			chongmingm.onclick = function(){
				if(this.parentNode.classList.contains('eshow')){
					handel.changename();
					rightlist.className = "";
				}
			}
		}

		var cut = document.querySelector('.eshow .cut');
		if(cut){
			cut.onclick = function(){
				if(this.parentNode.classList.contains('eshow')){
					handel.cut();
					rightlist.className = "";
				}
			}
		}
		
		var paste = document.querySelector('.paste');
		if(handel.cutid!=0 || handel.copyid!=0){
			paste.classList.add('mshow');
		}
		if(paste){
			paste.onclick = function(){
				if(this.parentNode.classList.contains('eshow') || this.classList.contains('mshow')){
					handel.paste();
					rightlist.className = "";
				}
			}
		}		

		var copy = document.querySelector('.eshow .copy');
		if(copy){
			copy.onclick = function(){
				handel.copy();
				rightlist.className = "";
			}
		}
	},
	allcheck:function(){
		var allcheck = document.querySelector('#conheader #checkbox');
		allcheck.onclick = function(){
			var box = document.querySelectorAll('.box');
			if(box.length != 0 ){
				if(allcheck.checked){
					box.forEach(function(item){
						item.classList.add('active');
					})
				}else{
					box.forEach(function(item){
						item.classList.remove('active');
					})
				}
			}
		}
	},
	all:function(){
		var box = document.querySelectorAll('#coninner .box');
		var boxactive = document.querySelectorAll('#coninner .active');
		var allcheck = document.querySelector('#conheader #checkbox');

		if(box.length == boxactive.length){
			allcheck.checked = true;
		}else{
			allcheck.checked = false;
		}
	},
	cut:function(){
		var cutbox = document.querySelectorAll('#coninner .active');
		if(cutbox.length == 0 ){
			alert('请选择目标文件');
			return;
		}
		handel.cutid = Array.from(cutbox).map(function(item){
			return item.getAttribute('idnum');
		});
		cutbox.forEach(function(item){
			item.classList.add('cutbox');
		})
		handel.copyid = [];
	},
	paste:function(){
		var ifchoose = handel.cutid.every(function(item){
			return item != handel.now;
		});

		if(handel.cutid.length != 0){
			if(ifchoose){
				handel.cutid.forEach(function(item){
					// console.log(handel.cutcompare(item,handel.now));
					if(handel.cutcompare(item,handel.now)){;
						var pastebox;
						handel.cutid.forEach(function(item){
							pastebox = handel.getByid(item);
							pastebox.pid = handel.now;
						})
						handel.cutid = [];
					}else{
						alert("目标文件夹是源文件夹的子文件夹");
					};
				})
			}else{
				alert("目标文件夹是源文件夹的子文件夹");
			}
		}else if(handel.copyid.length != 0){
			// console.log(handel.copyfolder(handel.copyid[0]))
			var newcopy = [];

			handel.copyid.forEach(function(item){

				newcopy = handel.clone(newcopy.concat(handel.copyfolder(item)),true);

				newcopy[0].pid = handel.now;

				newcopy.forEach(function(item,i){
					item.id += 100;
					if(i != 0){
						item.pid += 100;
					}
					data.push(item);
				});
			});
			// console.log(newcopy,data)
			handel.copyid = [];
		};
		handel.createfolder(handel.now);
		handel.createleft();
		handel.lefttree(handel.now);
	}, 
	copy:function(){
		var copybox = document.querySelectorAll('#coninner .active');
		handel.copyid = Array.from(copybox).map(function(item){
			return item.getAttribute('idnum');
		});
		handel.cutid = [];
	},
	cutcompare:function(id,now){
		// console.log(id,now)
		if(id == now){
			return false;
		}else{
			// console.log(handel.getByid(now).pid)
			if(handel.getByid(now).pid == 0){
				// console.log(1)
				return true;
			}else{
				// console.log(handel.getByid(now).id)
				if(handel.getByid(now).id == id){
					return false;
				}else{
					return handel.cutcompare(id,handel.getByid(now).pid);
					// return 12;
				}
			}
		}
	},
	copyfolder:function(id){
		var copyd = [handel.getByid(id)];

		if(handel.getByPid(id).length != 0){

			copyd = copyd.concat(handel.getByPid(id));

			handel.getByPid(id).forEach(function(item){
					copyd = copyd.concat(handel.getByPid(item.id));
					// console.log(handel.getByPid(item.id))
				}
			);

			// copyd.forEach(function(item,i){
			// 	item.id += 100;
			// 	if(i != 0){
			// 		item.pid += 100;
			// 	}
			// });

			return copyd;
		}else{
			return false;
		}
	},
	clone:function(target,deep){
		var res = target instanceof Array ? []:{};
		for(var attr in target){
			if( typeof target[attr] == 'object' && deep && target[attr] !== null ){
				res[attr] = handel.clone(target[attr],true);
			}else{
				res[attr] = target[attr];
			}
		}
		return res;
	}
}