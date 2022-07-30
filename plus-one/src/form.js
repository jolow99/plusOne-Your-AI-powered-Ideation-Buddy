console.log('inside form')
$(document).ready(function(){
    console.log("ready")

    $('form').find('.btn').on('click',function(){
       $(this).parent().css({
         'height' : '1000px',
         'transform' : 'translateY(1000px)'
       });
         $(this).siblings('.form-group').css({
           'top':'0%'
         });
        //  $(this).siblings('.links').css({
        //    'top':'65%'
        //  });
       });
     
   
   
   /*-------- focus in ---------*/
   $('.Qns-2').on('focusin',function(){
     $(this).siblings('.Qns-1').css({
       'z-index'   :'1',
       'background':'rgba(0,0,0)',
        'color'     :'black'
     });
     $(this).siblings('.Qns-3').css({
        'z-index'   :'1',
        'background':'rgba(0,0,0)',
        'color'     :'black'
      });
      $(this).css({
       'z-index' : '2',
       'background' : '#fff',
       'color'     :'black'
       });
   });
   
   
    $('.Qns-1').on('focusin',function(){
     $(this).siblings('.Qns-2').css({
       'z-index'   :'1',
       'background':'rgba(0,0,0)',
       'color'     :'black'
     });
     $(this).siblings('.Qns-3').css({
        'z-index'   :'1',
        'background':'rgba(0,0,0)',
        'color'     :'black'
      });
     $(this).css({
       'z-index' : '2',
       'background' : '#fff',
       'color'     :'black'
      });
   });

   $('.Qns-3').on('focusin',function(){
    $(this).siblings('.Qns-2').css({
      'z-index'   :'1',
      'background':'rgba(0,0,0)'
    });
    $(this).siblings('.Qns-1').css({
       'z-index'   :'1',
       'background':'rgba(0,0,0)'
     });
    $(this).css({
      'z-index' : '2',
      'background' : '#fff'
     });
  });
   
   /*----------- focus out ---------*/
   $('.Qns-1').on('focusout',function(){
     $(this).siblings('.Qns-2').css({
       'z-index'   :'1',
       'background':'rgba(0,0,0,.1)'
     });
     $(this).siblings('.Qns-3').css({
        'z-index'   :'1',
        'background':'rgba(0,0,0,.1)'
      });
     $(this).css({
       'z-index' : '2',
       'background' : '#fff'
     });
   });
   
   
   $('.Qns-2').on('focusout',function(){
    $(this).siblings('.Qns-1').css({
      'z-index'   :'1',
      'background':'rgba(0,0,0,.1)'
    });
    $(this).siblings('.Qns-3').css({
       'z-index'   :'1',
       'background':'rgba(0,0,0,.1)'
     });
    $(this).css({
      'z-index' : '2',
      'background' : '#fff'
    });
  });

  $('.Qns-3').on('focusout',function(){
    $(this).siblings('.Qns-2').css({
      'z-index'   :'1',
      'background':'rgba(0,0,0,.1)'
    });
    $(this).siblings('.Qns-1').css({
       'z-index'   :'1',
       'background':'rgba(0,0,0,.1)'
     });
    $(this).css({
      'z-index' : '2',
      'background' : '#fff'
    });
  });
 })