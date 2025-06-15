var lista = [];
document.getElementById("bin").defaultValue = 0;

function converter(){
    var bin = document.getElementById("bin").value.toString();
    
    var i = bin.length;
    var total = i-1;
    var control = false;
    var decimal = 0;

    for( j = i-1; j>=0;j-- ) {

        if(bin.charAt(j) != "1" && bin.charAt(j) != "0"){
            control = true;
            document.getElementById("dec").value = "ERROR";
            break;
        }
        decimal += parseInt(bin.charAt(j))* (Math.pow(2,(total-j)));
        lista.push(bin.charAt(j));
    }
    if(control == true){
        alert("Insira o número em binário!");
    }

    document.getElementById("dec").value = decimal;
}