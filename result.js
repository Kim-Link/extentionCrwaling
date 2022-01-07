window.onload = function () {
  var name = prompt("What's your name?");
  var lengthOfName = name.length;

  document.getElementById('output').innerHTML = lengthOfName;
};
