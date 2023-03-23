const origin = "https://localhost:8080/api/";

$(document).ready(function set() {
    loginbtnTextChange();
});

function productEmpty() {
    window.location.reload();
}

function moveProductDetails(productId) {
    location.href = 'product-detail.html?product_id=' + productId;
}

let pageNum = 0;
let hasNextPage;

$(window).scroll(function () {
    if ($(window).scrollTop() == $(document).height() - $(window).height()) {
        if (hasNextPage) {
            let keyword = $('.search-box').val();
            pageNum += 1;
            searchProduct(keyword)
        }
    }
});

function changeWindow(e) {

    let keyword = $('.search-box').val();
    if (keyword === "") {
        alert("키워드를 검색해 주세요.")
    } else {
        event.preventDefault();
        $('.product').replaceWith();
        pageNum = 0
        hasNextPage = true;
        searchProduct(keyword);
        $(".result").replaceWith(`<div class="result"></div>`)
    }
}

function searchProduct(keyword) {
    let sort = $('.search-detail').val();


    $.ajax({
        type: "GET",
        url: origin + 'es/product/list?search=' + keyword + '&page=' + pageNum + '&size=20' + '&sort=' + sort,
        data: {},
        success: function (response) {
            let productList = response.data;
            hasNextPage = response.hasNextPage;

            for (let i = 0; i < productList.length; i++) {
                let productId = productList[i].productId;
                let productName = productList[i].name;
                let img = productList[i].img;
                let productPrice = productList[i].price.toLocaleString();
                let html = `<div onclick="moveProductDetails(${productId})" class="product">
                                <div class="productImg"><img src=${img} alt=""></div>
                                    <div class="productName">${productName}</div>
                                <div class="productPrice">${productPrice}원</div>
                            </div>`
                $(".productSearched").append(html);
                $(".rankResult").empty();
                $(".rankingText").empty();

            }

            if (!hasNextPage) {
                $(".result").replaceWith(`<div class="result"> "${keyword}"에 대한 더이상의 검색결과가 없습니다. <div>`)
            }
        },
        error: function (response) {
            alert(response.responseJSON.msg);
        }
    })
}

function orderList() {
    if ($.cookie('auth') != null) {
        location.href = 'order_details.html'
    } else {
        alert("로그인을 해주세요.")
        location.href = "login.html";
    }
}

function loginbtnTextChange() {
    let btn = document.querySelector(".login");
    if ($.cookie('auth') != null) {
        btn.innerHTML = "로그아웃";
    }
}

deleteCookie = function (name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1999 00:00:10 GMT;';
}

function loginAndlogout() {
    let btn = document.querySelector(".login");

    if (btn.innerHTML == "로그인") {
        location.href = "login.html";
    } else if (btn.innerHTML == "로그아웃") {
        deleteCookie('auth');
        alert("로그아웃 성공!")
        location.href = 'index.html'
    }
}

$(document).ready(function () {
    rankingList();

});

function rankingList() {

    $.ajax({
        type: "GET",
        url: origin + 'rankingList',
        data: {},
        success: function (response) {
            let productList = response;
            for (let i = 0; i < 10; i++) {
                let productId = productList[i]['product']['productId'];
                let rankingNum = productList[i].id;
                let productName = productList[i].product.productName;
                let productImg = productList[i].product.img;
                let price = productList[i].product.price;
                let html = `<div class="rank" onclick="moveProductDetails(${productId})">
                                <div class="rankNum">${rankingNum}</div>
                                <div><img class="rankImg" src="${productImg}" alt=""></div>
                                <div class="rankName">${productName}</div>
                                <div class="rankPrice">${price}원</div>
                            </div>`
                $(".rankResult").append(html);
            }
        },
    })
}