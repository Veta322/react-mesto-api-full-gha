class Api {
    constructor({url,headers}) {
        this.url = url;
        this.headers = headers;
      
        
    }

_checkResponse(res) {
        if (res.ok) {
                    return res.json();
                }

                return Promise.reject(`Ошибка: ${res.status}`);
    }

    getInitialCards() {
        return fetch(this.url +'/cards', {
            method: 'GET',
            headers: this.headers
        })
             .then(this._checkResponse)
    }

    getPersonInfo() {
        return fetch(this.url +'/users/me', {
            method: 'GET',
            headers: this.headers
        })
            .then(this._checkResponse)
    }

    sendUserInfo(data) {
        return fetch(this.url +'/users/me', {
            method: 'PATCH',
            headers: this.headers,
            body: JSON.stringify({
                name: data.name,
                about: data.about
            })
        })
            .then(this._checkResponse)
    }

    addNewCard(data) {
        return fetch(this.url +'/cards', {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({
                name: data.name,
                link: data.link
            })
        })
           .then(this._checkResponse)
    }

    delCard(cardId) {
        return fetch(this.url +`/cards/${cardId}`, {
            method: 'DELETE',
            headers: this.headers,
        })
            .then(this._checkResponse)
    }

    likeCard(cardId) {
        return fetch(this.url +`/cards/likes/${cardId}`, {
            method: 'PUT',
            headers: this.headers,
        })
            .then(this._checkResponse)
    }

    removelikeCard(cardId) {
        return fetch(this.url +`/cards/likes/${cardId}`, {
            method: 'DELETE',
            headers: this.headers,
        })
            .then(this._checkResponse)
    }

    editAvatar(data) {
        return fetch(this.url +'/users/me/avatar', {
            method: 'PATCH',
            headers: this.headers,
            body: JSON.stringify({
                avatar: data.avatar
            })
        })
            .then(this._checkResponse)
    }

}

const api = new Api({
    url: "https://mesto.nomoreparties.co/v1/cohort-59",
    headers: {
        authorization: "131e7fdb-149f-4853-99c1-5f7c0b1924bf",
        "Content-Type": "application/json",
    },
})

export default api;