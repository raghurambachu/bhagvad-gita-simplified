
 

class BhagvadGita{
    constructor(formModal_DOM){
        
        this.contentContainer_DOM = document.querySelector(".chapter-content");
        this.formModal_DOM = formModal_DOM;
        this.createLayout();
        new Toggler(document.querySelector("#verse-toggle"),document.querySelector("#chapter-toggle"));
        new Dropdown(document.querySelector(".dropdown-chapter-root"));
        new Dropdown(document.querySelector(".dropdown-verse-root"));
        this.handlers();
    }
    createLayout(){
        this.formModal_DOM.innerHTML = `
            <div class="form-toggle">
                <button id="verse-toggle">Verse</button>
                <button id="chapter-toggle">Chapter</button>
            </div>
        
            <div id="verse-form" >
                <form class="verse-form" data-type="verse">
                    <div class="dropdown-verse-root"></div>
                    <div class="form-group">
                        <label for="verse-input">Verse Number</label>
                        <input class="verse-number" type="number" placeholder="Verse no. ex: 24">
                    </div>
                    <button  class="btn btn-submit">Submit</button>
                </form>
            </div>
        
            <div id="chapter-form">
                <form data-type="chapter" class="chapter-form">
                    <div class="dropdown-chapter-root"></div>
                    <button class="btn btn-submit">Submit</button>
                </form>
            </div>
        `
    }

    handlers(){
        // setInterval(async () => {
        //     this.authKey = await this.getAuthToken()
        // },300000)

        this.verseForm_DOM = document.querySelector(".verse-form");
        this.chapterForm_DOM = document.querySelector(".chapter-form");

        this.verseForm_DOM.addEventListener("submit",(e) => {
            e.preventDefault()
            this.handleClickOnVerseSubmitBtn(e)
        })

        this.chapterForm_DOM.addEventListener("submit", (e) => {
            e.preventDefault();
            this.handleClickOnChapterSubmitBtn(e)
        })

       window.addEventListener("load",(e) => {

            // this.authKey = localStorage.getItem("authKey") || 

            // By default  fetch verse number for selected chapter;
            const selectedChapter = this.verseForm_DOM.querySelector(".selected").dataset.value;
            this.getValidVerseNumbers(selectedChapter);
       })

    }

    async getValidVerseNumbers(selectedChapter){
        let tokenPromise = await this.getAuthToken();
        tokenPromise = await tokenPromise.json();
        let token = tokenPromise.access_token;
        let chapter = await fetch(`https://bhagavadgita.io/api/v1/chapters/${selectedChapter}?access_token=${token}`);
        chapter = await chapter.json()
        const chapterVerseNumber = chapter.verses_count;

        const verseInput_DOM = document.querySelector(".verse-number");
        // verseInput_DOM.setAttribute("placeholder",)


    }

    async handleClickOnVerseSubmitBtn(e){
      
        // const response = await fetch(url)
    }

    async getAuthToken(){
        const url = "https://bhagavadgita.io/auth/oauth/token";
        const token = await fetch("https://bhagavadgita.io/auth/oauth/token", {
            body: "client_id=dl2DICua80k5iEzBvXeAN20vtTMjkgLnpdFZ4anj&client_secret=48Fy9kIMZ3NKaWalUusMW3yPj7fg7aRXA6RGefk3lvwCWiFh6o&grant_type=client_credentials&scope=verse%20chapter",
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            json: true

          })
          return token;
    }

    moveLayoutToLeftSide(){
        //moves layout to leftside and chapter-content to right-side.
        document.querySelector(".modal").style.transform = "translateX(-30%)";
        document.querySelector(".chapter-content").classList.add("chapter-content-display");
    }

    async handleClickOnChapterSubmitBtn(e){
        this.moveLayoutToLeftSide();
        const tokenPromise = await this.getAuthToken().then(data => data.json());
        const token = tokenPromise.access_token;

        const selectedChapter = e.target.querySelector(".chapter-form .selected").dataset.value;

        document.querySelector(".loading").style.display = "block";
        const fetchChapterDetails = await fetch(`https://bhagavadgita.io/api/v1/chapters/${selectedChapter}?access_token=${token}`).then(data => data.json());
        document.querySelector(".loading").style.display = "none";

        this.contentContainer_DOM.innerHTML = `
            <img class="loading" src="./assets/media/spinner.gif" alt="loader">
        `;
        let chapter = fetchChapterDetails;
        this.contentContainer_DOM.innerHTML += `
                <h2 class="chapter-title">${chapter.chapter_number} - ${chapter.name}
                </h2>
                <h4>${chapter.name_transliterated}</h4>   
                <h3 class="chapter-meaning">${chapter.name_meaning}</h3>
                <p class="chapter-summary">
                ${chapter.chapter_summary}
                </p>
            
                <p class="chapter-total">Total Verses : ${chapter.verses_count}</p>
       
        `;
    }
}

const app = new BhagvadGita(formModal_DOM)