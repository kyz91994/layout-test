$(function () {
    $('.next-step').on('click',()=> {
        $('.step--1').removeClass('form__fields--open')
        $('.step--2').addClass('form__fields--open')
    })
    $('.prev-step').on('click',()=> {
        $('.step--2').removeClass('form__fields--open')
        $('.step--1').addClass('form__fields--open')
    })


    $('.header__burger-btn').on('click', ()=> {
        $('.menu').toggleClass('menu--open')
        $('.sign-btn').toggleClass('sign-btn--open')
        $('.login-btn').toggleClass('login-btn--open')
        $('.header__burger-btn').toggleClass('header__burger-btn--open')


    })





})