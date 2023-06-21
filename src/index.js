let quoteTotal = []
let likeTotal = []
const quoteListUl = document.getElementById("quote-list")
let sortToggle = false
document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:3000/quotes")
    .then(res => res.json())
    .then(quotes => {
        quoteTotal = quotes
        quotes.forEach(quote => { renderQuote(quote) })
        quoteSorter(quoteTotal)
        newQuote()
    })
})
function newQuote() {
    const newQuoteForm = document.getElementById("new-quote-form")
    const newQuoteInput = document.getElementById("new-quote")
    const newQuoteAuthor = document.getElementById("author")
    newQuoteForm.addEventListener("submit", (e) => {
        e.preventDefault()
        const newQuote = {
            quote: newQuoteInput.value,
            author: newQuoteAuthor.value
        }
        fetch("http://localhost:3000/quotes", {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
                'Accept': "application/json"
            },
            body: JSON.stringify(newQuote) 
        })
        .then(res => res.json())
        .then(data => {
            quoteTotal.push(newQuote)
            renderQuote(newQuote)
            newQuoteInput.value = ""
            newQuoteAuthor.value = ""
        })
    })
}
function renderQuote(quote) {
    
    const quoteLi = document.createElement("li")
    quoteLi.className = "quote-card"
    
    const blockQuote = document.createElement("blockquote")
    blockQuote.className = "blockQuote"
    
    const quotePara = document.createElement("p")
    quotePara.className = "mb-0"
    quotePara.textContent = quote.quote
    
    const quoteAuthor = document.createElement("footer")
    quoteAuthor.className = "blockquote-footer"
    quoteAuthor.textContent = quote.author
    
    const quoteBr = document.createElement("br")
    
    const quoteId = quote.id
    
    let quoteLikeTotal = 0
    
    let likeCounter = 0

    fetch("http://localhost:3000/likes/")
        .then(res => res.json())
        .then(likes => {
            likeTotal = likes
            for(let i = 0; i < likeTotal.length; i++) {
                if(likeTotal[i].quoteId === quoteId) {
                    likeCounter++
                }
            }
            quoteLikeTotal = likeCounter
            const quoteLikeSpan = document.createElement("span")
             quoteLikeSpan.textContent = quoteLikeTotal
      
            const quoteLikes = document.createElement("button")
            quoteLikes.className = "btn-success"
            quoteLikes.textContent = `Likes: ${quoteLikeSpan.textContent}`
            quoteLiker(quoteLikes, quoteLikeSpan, quoteId)
            const quoteDelete = document.createElement("button")
            quoteDelete.className = "btn-danger"
            quoteDelete.textContent = "Delete"
            
            quoteDelete.addEventListener("click", () => {
                quoteLi.innerHTML = ""
                quoteLi.remove()
            })
            
            const quoteEdit = document.createElement("form")
            quoteEdit.id = "edit-quote"
            
            const quoteEditInput = document.createElement("input")
            quoteEditInput.name = "edit"
            quoteEditInput.type = "text"
            quoteEditInput.className = "form-control"
            quoteEditInput.placeholder = "Edit the quote here..."
            
            quoteEdit.addEventListener("keydown", (e) => {
                if(e.keyCode === 13) {
                    e.preventDefault()
                    console.log(`Entered`)
                    const quoteChangeInput = quoteEditInput.value
                    quotePara.textContent = quoteChangeInput
                    quoteEditInput.value = ""
                }
            })
            
            quoteEdit.append(quoteEditInput)
            
            blockQuote.append(quotePara, quoteAuthor, quoteBr, quoteLikes, quoteDelete, quoteEdit)
            quoteLi.append(blockQuote)
            quoteListUl.append(quoteLi)
        })

    function quoteLiker(quoteLikes, quoteLikeSpan, quoteId) {
        quoteLikes.addEventListener("click", () => {
            quoteLikeTotal++
            quoteLikeSpan.textContent = quoteLikeTotal
            quoteLikes.textContent = `Likes: ${quoteLikeSpan.textContent}`
            const timeStamp = Date.now();
            const likedQuote = {
                quoteId: quoteId,
                createdAt: timeStamp
            }
            fetch("http://localhost:3000/likes", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(likedQuote)
            })
        })
    }
}
function quoteSorter(quoteTotal) {
    const sortButton = document.getElementById("sort-button")
    sortButton.addEventListener("click", () =>{
        console.log(quoteTotal)
        if (sortToggle === false) {
            quoteTotal.sort(function (a, b) {
                if (a.author < b.author) {
                    return -1
                }
                if (a.author > b.author) {
                    return 1
                }
                return 0
            })
            sortButton.textContent = "Sort On"
            sortToggle = true
        } else {
            quoteTotal.sort(function (a, b) {
                if (a.id < b.id) {
                    return -1
                }
                if (a.id > b.id) {
                    return 1
                }
                return 0
            })
            sortButton.textContent = "Sort Off"
            sortToggle = false
        }
        console.log(quoteTotal)
        quoteListUl.innerHTML = ""
        quoteTotal.forEach(quote => { renderQuote(quote) })
    })
}
