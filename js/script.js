window.onload = async () => {
  let plain_words = await fetch("data/bee3plain.txt").then(e => e.text()).split("\n");
  let words = await fetch("data/bee3.txt").then(e => e.text()).split("\n");
  let words_number = words.length;
  
  function generate_word_index() {
    return Math.floor(Math.random() * words_number);
  }
  
  let current_word;
  let current_word_index;
  let current_plain_word;
  
  let current_word_audio;
  
  let current_word_definitions;
  
  function assign_word_audio(file) {
    current_word_audio = new Audio(file);
  }
  
  function play_word() {
    current_word_audio.play();
  }
  
  let correct_audio = new Audio("audio/correct.mp3");
  let incorrect_audio = new Audio("audio/incorrect.mp3");
  
  function fetch_word() {
    return fetch(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${current_word}?key=APIKEY`).then(e => e.json());
    // fill in for APIKEY
  }
  
  let audio_letter_regex = /^[a-zA-Z]/;
  
  function format_audio(audio) {
    if (audio.startswith("bix")) return "bix";
    else if (audio.startswith("gg")) return "gg";
    else if (audio_letter_regex.test(audio)) return audio[0];
    else return "number";
  }
  
  function display_word_definitions(definitions) {
    document.getElementById("def").innerHTML = definitions.map(definition => `<p class="mb-2">${definition}</p>`).join("");
  }
  
  function process_data(data) {
    let audio = data.hwi.prs[0].sound.audio;
    assign_word_audio(`https://media.merriam-webster.com/audio/prons/en/us/mp3/${format_audio(audio)}/${audio}.mp3`);
    
    display_word_definitions(data.shortdef);
  }

  async function load_word() {
    current_word_index = generate_word_index();
    current_word = words[current_word_index];
    current_plain_word = plain_words[current_word_index]
    process_data(fetch_word());
    play_word();
  }
  
  let non_alpha_regex = /[^a-zA-Z]/;
  
  function clean_word(word) {
    return word.replace(non_alpha_regex, "").toLowerCase();
  }
  
  function check_word() {
    if (clean_word(document.getElementById("word").value) == current_plain_word) {
      correct_audio.play();
      load_word();
    } else {
      incorrect_audio.play();
    }
  }
  
  document.getElementById("word").addEventListener("keypress", e => {
    if (event.key === "Enter") check_word();
  });
  
  document.getElementById("new").addEventListener("click", () => {
    load_word();
  });
  
  document.getElementById("listen").addEventListener("click", () => {
    play_word();
  });
}
