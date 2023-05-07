function uploadFile() {
    var fileInput = document.getElementById("fileInput");
    var file = fileInput.files[0];
  
    if (file) {
      var reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function(event) {
        var contents = event.target.result;
        var div = document.createElement("div");
        div.setAttribute("id", "output");
        document.getElementById("left").innerHTML="";
        document.getElementById("left").appendChild(div);
        var output = document.getElementById("output");
        output.textContent = contents;
  
        catalogar();
      }
    }
  }
  
  function catalogar() {
    var div = document.getElementById("output");
    var texto = div.textContent.trim();
    var palavras = texto.split(/\s+/);
  
    var out = "";
    for (var i = 0; i < palavras.length; i++) {
      out += "<span onclick='procura(this)'>" + palavras[i] + "</span> ";
    }
    div.innerHTML = out;
  }

  function makeTextBox(info){
    var word = info[0].word;
    var phonetic;
    var meanings;
    var audio;

    info.forEach(el =>{
        el.phonetics.forEach(f =>{
            if(f.text && f.audio){
                phonetic = f.text;
                audio = f.audio;
                return;
            }
        })

    })

    info.forEach(el => {
        el.phonetics.forEach(f =>{
            if(f.text){
                phonetic = f.text;return;
            }
        });

        
    });
    info.some(el => {
        if(el.meanings){
            meanings = el.meanings;return true;
        }
            
    });


    

    var dl_meanings = "";

    meanings.forEach(el =>{
        if(el.partOfSpeech){
            dl_meanings += "<br><dt> Part of Speech:"+el.partOfSpeech+"</dt>";

            var i = 0;
            el.definitions.forEach(m =>{
                i++;
                dl_meanings += "<br><dd> Definition " +i+" :"+(m.definition|| "No Definition available")+"</dd>";
                let exit_ex = (m.example || "");
                dl_meanings += (exit_ex === "")?"":"<dd> &emsp;<i>Example:"+(m.example || "No Example available")+"</i></dd>";
                var synonyms="";
                m.synonyms.forEach(sy => {
                    synonyms += (sy+" ");
                })
                dl_meanings += (synonyms.trim() ==="")?"": "<dd> Synonyms:"+synonyms +"</dd>";

                var antonyms="";
                m.antonyms.forEach(sy => {
                    antonyms += (sy+" ");
                })
                dl_meanings += (antonyms.trim() ==="")?"":"<dd> Antonyms:"+antonyms +"</dd>";
            })
            
        }
    })

var audio = (audio)?"<audio controls><source src='"+audio+"' type='audio/mpeg'>Your browser does not support the audio element.</audio>":"";
    

    var html = "<div id='word'>Term: "+word+"</div> <br> " + 
      "<div id='phonetic'>Phonetic:" + (phonetic || "---") +" </div> <br>"+ audio+ " <br><div id = meanings>"+dl_meanings+"</div>";


      document.getElementById("right").innerHTML= html;
   
    console.log(meanings);



  }
  
  function procura(e) {
    var palavra = e.textContent.trim().replace(/[?!;.,:]/g, '').replace(/\d+/g, '').replace(/[\[\]]/g, '');
  
    var pesquisa = 'https://api.dictionaryapi.dev/api/v2/entries/en/' + palavra;

    fetch(pesquisa)
    .then(e => {
        if (!e.ok) {document.getElementById("right").innerHTML = "I'm sorry, I don't know either :(";throw new Error('Erro de rede ou palavra inexistente');}
        return e.json();
  }).then(info => {makeTextBox(info);})
  .catch(err => {console.error(err);});

    console.log(palavra);

  };
  
  
  $(document).ready(function() {
    $('#fileInput').on('change', function() {
      uploadFile();
    });
  });
  