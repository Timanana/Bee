window.onload = async () => {
  let words = await fetch("data/bee3plain.txt").then(e => e.text()).split("\n"); // although the DictionaryAPI may not have spellcheck
  let words_number = words.length;
  
  function generate_word() {
    return words[Math.floor(Math.random() * words_number)];
  }
  
  let current_word;
  
  let current_word_audio;
  
  function assign_word_audio(file) {
    current_word_audio = new Audio(file);
  }
  
  function play_word() {
    current_word_audio.play();
  }
  
  function fetch_word() {
    return fetch(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${current_word}?key=APIKEY`).then(e => e.json());
    // fill in for APIKEY
  }
  
  function format_audio(audio) {
    if (audio.startswith("bix")) return "bix";
    else if (audio.startswith("gg")) return "gg";
    else if (/^[a-zA-Z]/.test(audio)) return audio[0];
    else return "number";
  }
  
  function process_data(data) {
    let audio = data.hwi.prs[0].sound.audio;
    assign_word_audio(`https://media.merriam-webster.com/audio/prons/en/us/mp3/${format_audio(audio)}/${audio}.mp3`);
  }

  async function load_word() {
    current_word = generate_word();
    process_data(fetch_word());
    play_word();
  }
  
  // handle input (when you press enter, check work; when you click on listen again, play the audio again; when you click on new word, give them a new word and just do load_word all over again)
}
