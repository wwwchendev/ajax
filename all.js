// 選取表單元素
const pokemonSelector = document.getElementById('selectPokemon');
const imgElement = document.getElementById("pokemonSprite");
const btnXMLHttpRequest = document.getElementById("btnXMLHttpRequest");
const btnFetch = document.getElementById("btnFetch");
const btnAxios = document.getElementById("btnAxios");
const showCodeEl = document.getElementById("showCode");

// 宣告變數
let selectedPokemon = 'pikachu';
let selectedOption = '皮卡丘 pikachu';
let currentMethod = 'XMLHttpRequest';

// 監聽選取狀態
pokemonSelector.addEventListener('change', function (e) {
  selectedPokemon = e.target.value.toLowerCase(); // value
  selectedOption = e.target.selectedOptions[0].innerText; // 顯示文字
  // console.log(`${selectedPokemon}, ${selectedOption}`);
  if (currentMethod === 'XMLHttpRequest') {
    getDataWithXML(selectedPokemon)
  } else if (currentMethod === 'fetch') {
    getDataWithFetch(selectedPokemon);
  } else if (currentMethod === 'axios') {
    getDataWithAxios(selectedPokemon)
  }
});
btnXMLHttpRequest.addEventListener('click', () => { getDataWithXML(selectedPokemon) })
btnFetch.addEventListener('click', () => { getDataWithFetch(selectedPokemon); });
btnAxios.addEventListener('click', () => { getDataWithAxios(selectedPokemon) })


// 方法1:使用XMLHttpRequest
function getDataWithXML(pokemonName) {
  currentMethod = 'XMLHttpRequest';
  const xhr = new XMLHttpRequest();
  showCode('XMLHttpRequest')
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        const pokemonSprite = data.sprites.front_default;
        changePicture(pokemonSprite);
      } else {
        console.error("請求資料時發生錯誤");
      }
    }
  };
  xhr.open('GET', `https://pokeapi.co/api/v2/pokemon/${pokemonName}`, true);
  xhr.send();
}

// 方法2:使用fetch搭配async/await和try/catch錯誤處理
async function getDataWithFetch(pokemonName) {
  currentMethod = 'fetch';
  showCode('fetch')
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    if (!response.ok) {
      throw new Error("請求資料時發生錯誤");
    }
    const data = await response.json();
    const pokemonSprite = data.sprites.front_default;
    changePicture(pokemonSprite);
  }
  catch (error) {
    console.error(error);
  }
}

// 方法3:使用axios
function getDataWithAxios(pokemonName) {
  currentMethod = 'axios';
  showCode('axios')
  imgElement.src = './public/guess.jpg';
  axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    .then(response => {
      const data = response.data;
      const pokemonSprite = data.sprites.front_default;
      changePicture(pokemonSprite);
    })
    .catch(error => {
      console.error("請求資料時發生錯誤", error);
    });
}

// 更換圖片
async function changePicture(imgUrl) {
  await setTimeout(() => {
    imgElement.src = imgUrl;
  }, 1000)
}

// 顯示代碼
function showCode(method) {
  showCodeEl.innerHTML = `目前用於請求資料的方法是 ${currentMethod}
  `;
  if (method === 'XMLHttpRequest') {
    showCodeEl.innerHTML += `
    function getDataWithXML(pokemonName) {
      console.log('使用XMLHttpRequest請求資料');
      const xhr = new XMLHttpRequest();
    
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            const pokemonSprite = data.sprites.front_default;
            changePicture(pokemonSprite);
          } else {
            console.error("請求資料時發生錯誤");
          }
        }
      };
    
      xhr.open('GET', \`https://pokeapi.co/api/v2/pokemon/\${pokemonName}\`, true);
      xhr.send();
    }`;
  } else if (method === 'fetch') {
    showCodeEl.innerHTML += `
    async function getDataWithFetch(pokemonName) {
      console.log('使用fetch請求資料');
      try {
        const response = await fetch(\`https://pokeapi.co/api/v2/pokemon/\${pokemonName}\`);
        if (!response.ok) {
          throw new Error("請求資料時發生錯誤");
        }
        const data = await response.json();
        const pokemonSprite = data.sprites.front_default;
        changePicture(pokemonSprite);
      } catch (error) {
        console.error(error);
      }
    }`;
  } else if (method === 'axios') {
    showCodeEl.innerHTML += `
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
  
    function getDataWithAxios(pokemonName) {
      console.log('使用axios請求資料');
      imgElement.src = './public/guess.jpg';
      axios.get(\`https://pokeapi.co/api/v2/pokemon/\${pokemonName}\`)
        .then(response => {
          const data = response.data;
          const pokemonSprite = data.sprites.front_default;
          changePicture(pokemonSprite);
        })
        .catch(error => {
          console.error("請求資料時發生錯誤", error);
        });
    }`
  }

}