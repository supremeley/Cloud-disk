handel.createleft();
handel.createNav(1);
handel.createfolder(1);
handel.lefttree(1);
handel.addDocumentEvent();
handel.F2();
handel.rightbutton();
handel.rightfun();
handel.allcheck();

var create = document.getElementsByClassName('create')[0];
var del = document.getElementsByClassName('del')[0];
var chongmingm = document.getElementsByClassName('chongmingm')[0];
var yidong = document.getElementsByClassName('yidong')[0];

create.onclick = function(){
	handel.addFolder();
	return false;
}

del.onclick = function(){
	handel.delFolder();
	return false;
}

chongmingm.onclick = function(){
	handel.changename();
	return false;
}

document.oncontextmenu = function(){
	return false;
}

yidong.onclick = function(){
	handel.cut();
}