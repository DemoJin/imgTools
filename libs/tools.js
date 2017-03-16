window.imgTools={
    version:'1.0.3'
};

var rootPath = $('#rootPath').val();

/*var winTopIfr = window.top.document.documentElement.clientHeight-70;
var ifr = window.top.document.getElementById('frameWin_content'),
    sidebar= window.top.document.querySelector('.sidebar'),
    erp_right= window.top.document.querySelector('.erp_right');

ifr.height(winTopIfr); */

//父页面分辨率
var winTopIfr = window.screen.height-180;

$(function(){

    //整个父级页面的初始高度
    var curH = $(window).height()-$('.tools-header').height()-2;
    $('.tools-main').height(curH);
    $('.tools-content').height(curH);
    // 裁剪iframe宽高赋值
    $('#ifrmid').width($(window).width()-260);    
    $('#ifrmid').height($(window).height()-58); 
    $('#ifrmid').css({'top':'0','left':'260px'}); 
    //loading位置赋值
    $('.loading').css('top',(winTopIfr-60)/2);
    //screenAlert位置赋值
    $('.screen-alert').css('top',(winTopIfr-60)/2);
    // setParentIframeHeight('ifrmid');
    
    var isActive = 0;
    //左侧操作监听
    $('.tools-nav dt').click(function(){

        curIndex = $(this).index();

        var _this = $(this);
        isActive = 0;

        if (_this.hasClass('active')) {
            return false;
        }

        if ($('.tools-list li').length<1) {
            screenAlert('请先添加图片后再操作！');
            return false;
        }

        //遍历 确认active状态
        $('dd').each(function(){
            if (!$(this).find('.sure').hasClass('active')) {
                //提示框显示
                $('.screen-confirm').fadeIn(50).css('top',(winTopIfr-$('.screen-confirm').height()+120)/2);
                $('.screen-bg').css({'top':'0','left':'0'}).css('display','block');
                isActive = 1;
            }
        }); 

        if (isActive == 1) {
            return false;
        }
        //当前状态展示
        _this.addClass('active').next().slideDown(200).end().siblings('dt').removeClass('active').next().slideUp(200);

        //初始化工具方法
        initArrFn(_this);
  
    });

    //监听裁剪select赋值
    $('#cutCrop').change(function(){
        var w = $(this).val().split('*')[0];
        var h = $(this).val().split('*')[1];
        document.getElementById("ifrmid").contentWindow.childtest(w,h);
    });
   
   //监听select状态
    $('select').change(function(){
        $(this).parents('dd').find('.sure').removeClass('active').end().prev().find('mark').hide();
    });

    //提示窗
    $('.screen-confirm button').click(function(){
        //确认
        if ($(this).hasClass('sure')) {
            var curDt = $('.tools-nav dt:eq('+curIndex/2+')');
            $('.tools-nav dt:eq('+curIndex/2+')').addClass('active').next().slideDown(200).end().siblings('dt').removeClass('active').next().slideUp(200);
            Console($('.tools-nav dt:eq(2)').text());
            $('.screen-confirm').fadeOut(50);
            $('.screen-bg').css({'top':'0','left':'0'}).fadeOut(0);
            $('dd .sure').addClass('active');
            
            //判断是否剪裁区域被触发
            if ($('#cutClick').hasClass('active')) {
                //非裁剪
                $('.tools-list li:first-child').trigger('click');
            }else{
                //裁剪
                tools.screenClose();
                initArrFn(curDt);
                $('#cutCrop').val('40*30');

                /*try{
                    ifrmname.window.cropArr();
                    // Console(JSON.stringify(ifrmname.window.cropArr()),'-----ifrmname');
                    if (ifrmname.window.cropArr().length>=1) {
                        $.each(ifrmname.window.cropArr(),function(i,n){
                             $('.tools-list').append('<li><img src="'+n+'"></li>');
                        });
                    }
                    $('#cutCrop').val('40*30');
                    $('#ifrmid').hide().attr('src','');
                    sessionStorage.isCrop = 0;
                }catch(e){
                    Console(e);
                    $.each(initArr,function(i,n){
                         $('.tools-list').append('<li><img src="'+n+'"></li>');
                    });
                }*/
                
            }
        }else{
        //取消    
            $('.screen-confirm').fadeOut(50);
            $('.screen-bg').css({'top':'0','left':'0'}).fadeOut(0);
            /*$.each(curArr,function(i,n){
                 $('.tools-list').append('<li><img src="'+n+'"></li>');
            });*/
        }
    });

    //水印方式切换
    $('.tab span').click(function(){
        $(this).addClass('active').siblings().removeClass('active');
        $('.site select').val('upperLeft');

        if ($(this).text()=='图片') {
           $('.tab-txt').fadeOut(0);
           $('.tab-img').fadeIn(200);
        }else{
            // return false;
            $('.tab-img').fadeOut(0);
            $('.tab-txt').fadeIn(200);
        }
    });

    //监听图片列表触发
    $('.tools-list').on('click','li',function(){
        var imgSrc = $(this).find('img').attr('src');   
        // Console(imgSrc); 
        $('.screen-main img').attr('src',imgSrc);
        setTimeout(function(){
            if ($('#cutClick').hasClass('active')) {
                //裁剪弹窗展示
                $('.screen-main').fadeIn(200);

                var imgW = $('.screen-main img').width(),
                    imgH = $('.screen-main img').height(),
                    // topH = ($(window).height()-imgH-50)/2,
                    topH = (winTopIfr-imgH)/2,
                    leftW = ($(window).width()-imgW-50)/2;

                $('.screen-bg').css({'top':'58px','left':'260px'}).fadeIn(0);
                $('.screen-main').height(imgH+36).width(imgW).css({'top':topH,'left':leftW+130});
                $('.screen-header').width(imgW);
            }else{
                
                $('.screen-bg').css({'top':'0','left':'0'}).fadeIn(0);
                $('.screen-main').fadeIn(200);
                var imgW = $('.screen-main img').width(),
                    imgH = $('.screen-main img').height(),
                    // topH = ($(window).height()-imgH-50)/2,
                    topH = (winTopIfr-imgH)/2,
                    leftW = ($(window).width()-imgW-50)/2;

                $('.screen-main').height(imgH+36).width(imgW).css({'top':topH,'left':leftW});
                $('.screen-header').width(imgW);
            }
        },100);

    });

    //close&clear
    $('.screen-close,.screen-bg').click(function(){
        tools.screenClose();
        clearTimeout(timer);
    });

    //工具方法初始化
    tools.init();

});

//isdebug
function Console(cb){
    if (localStorage.isdebug == 1) {
        console.log(cb);
    }
};

//初始化数组方法
function initArrFn(_this){

    imgArr = []; //只供裁剪使用
    curArr = []; //当前操作数组
    sessionStorage.clear(); 
    $('.tools-list li').each(function(i){
         curArr.push($(this).find('img').attr('src'));
    });

    if (_this.find('mark').is(':hidden')) {
        prevArr = [];
        $('.tools-list li').each(function(i){
            prevArr.push($(this).find('img').attr('src'));
        });
    }else{
        // screenAlert('当前是选中状态');
    }

    $('.tools-list').empty();

    $.unique(initArr); 
    $.unique(curArr); 

    if (curArr.length<1) {

        $.each(initArr,function(i,n){
            $('.tools-list').append('<li><img src="'+n+'"></li>');
        });

    }else{
        Console(curArr,'----curArrcreat');
        // $('.tools-list li').each(function(){
        //    curArr.push($(this).find('img').attr('src')); 
        // });
        $.each(curArr,function(i,n){
             $('.tools-list').append('<li><img src="'+n+'"></li>');
        });
    }
    // _this.addClass('active').next().slideDown(200).end().siblings('dt').removeClass('active').next().slideUp(200);

    //裁剪
    if ($('#cutClick').hasClass('active')) {
        // $('.tools-list li:first-child').trigger('click');
        cutArr =[];
        $('.tools-list li').each(function(i){
             cutArr.push($(this).find('img').attr('src'));
        });
        sessionStorage.cutArr = JSON.stringify(cutArr);
        sessionStorage.imgArr = JSON.stringify(imgArr);

        // $('#ifrmid').show().attr('src',rootPath+'/libs/crop.html');
        $('#ifrmid').show().attr('src','crop.html');

        sessionStorage.isCrop = 1;
    }else{
        // tools.screenClose();
        $('#ifrmid').hide().attr('src','');
        sessionStorage.isCrop = 0;
    }
}

//动态赋值iframe（暂时没用到）
function setParentIframeHeight(id){
    try{
        var parentIframe = parent.document.getElementById(id);
         if(window.attachEvent){
            window.attachEvent("onload", function(){
                parentIframe.height = document.documentElement.scrollHeight;
            });
            return;
        }else{
            window.onload = function(){
                parentIframe.height = document.body.scrollHeight;
            };
            return;                 
        }     
    }catch(e){
        throw new Error('setParentIframeHeight Error');
    }
}

//裁剪页面初始化select
function parenttest(){
  $('dd:nth-child(2),dd:nth-child(4)').find('select').val('40*30');
  document.getElementById("ifrmid").contentWindow.childtest(40,30);
}

//水印字符长度限制
function wmTxt(){ 
    var count = $("#wmTxt").val().length; 
    if(count>30){ 
        var wmTxt = $("#wmTxt").val().substring(0,30); 
        $("#wmTxt").val(wmTxt); 
        count=30; 
    } 

    // var str = /^[A-Za-z0-9]{30}/;
    // if (!str.test($('#wmTxt').val())){
    //     var wmTxt = $("#wmTxt").val().substring(0,30); 
    //     $("#wmTxt").val(wmTxt); 
    // }
} 

//base64转义
function convertImgToBase64(url, callback,isCount, outputFormat){
  var canvas = document.createElement('CANVAS'),
    ctx = canvas.getContext('2d'),
    img = new Image;
  img.crossOrigin = 'Anonymous';
  img.onload = function(){
    canvas.height = img.height;
    canvas.width = img.width;
    ctx.drawImage(img,0,0);
    var dataURL = canvas.toDataURL(outputFormat || 'image/jpeg',0.5);
    callback.call(this, dataURL,isCount);
    canvas = null; 
  };
  img.src = url;
}

var timer = {};
//alert模态框
function screenAlert(txt){
    $('.screen-alert,.screen-bg').fadeIn(100);
    $('.screen-alert p').html(txt);
    timer = setTimeout(function(){
        $('.screen-alert,.screen-bg').fadeOut(50);
    },3000);
}

//imgTools方法绑定
var tools ={
    version:'',
    init:function(){
        initArr = [], //初始路径
        curArr = [], //当前数组
        prevArr = [], //上一次数组
        saveArr = []; //保存数组(暂时没用)
        //修改尺寸
        tools.dimensionModify();
        //裁剪
        tools.imgCut();
        //添加水印
        tools.watermarkAdd();

        //确认
        tools.curSure();
        //取消
        tools.curCancle();

        //添加图片
        $('.add-file button').click(function(){
            tools.addImg();
        });

        //载入图片
        $('.load-file button').click(function(){
            tools.loadImg();
        });
        //enter
        document.onkeydown=function(event){
            var e = event || window.event || arguments.callee.caller.arguments[0];
            if(e && e.keyCode==13){
                tools.loadImg();
            }
        };

        //清空
        $('#clearBoth').click(function(){
            tools.clearBoth();
            Console(document.getElementById("file").files);
        });

        //保存弹框
        $('.save').click(function(){
            if ($('.tools-list li').length<1) {
                screenAlert('没有需要保存的图片！');
                return false;
            };

            $('.screen-save').css('top',(winTopIfr-$('.screen-save').height()+150)/2);
            $('.screen-save,.screen-bg').fadeIn(100);

        });

        //确认保存
        $('.screen-save .sure').click(function(){
            if ($('#saveName').val().length<1) {
                screenAlert('请输入文件名！');
                return false;
            }else if($('#saveName').val().length>20){
              screenAlert('文件名过长,请控制在20个字符以内！');
              return false;
            };
            tools.saveImg();
        });

        //取消保存
        $('.screen-save .cancle').click(function(){
            $('.screen-save,.screen-bg').fadeOut(100);
            $('#saveName').val('');
        });
        
        //撤销全部
        $('#revokeAll').click(function(){
            // prevArr = [];
            curArr = [];
            $('dd .sure').addClass('active');
            $('dd:nth-child(2),dd:nth-child(4)').find('select').val('40*30');
            $('.tools-list').empty();
            $('#wmTxt').val('');
            $('#fontFamily').val('Microsoft YaHei');
            $('#fontSize').val('18');
            $('#opacitySel').val('1');
            $('#siteSel').val('upperLeft');
            $('#ifrmid').hide().attr('src','');
            sessionStorage.isCrop = 0;
            $.each(initArr,function(i,n){
                 $('.tools-list').append('<li><img src="'+n+'"></li>');
            });
            $('dd').slideUp(200).prev().removeClass('active').find('mark').css('display','none');
            if (initArr.length<1) {
                screenAlert('请先添加图片后再操作！');
                $('dd:nth-child(2)').slideDown(50)
                return false;
            }
            $('dt:nth-child(1)').trigger('click');
        });
        
    },
    //关闭当前弹窗
    screenClose:function(){
        $('.screen-bg,.screen-save,.screen-alert,.screen-confirm,.screen-main').fadeOut(50);
        $('#saveName').val('');
        $('.screen-main img').attr('src','');
    },
    //用于路径累加回调（暂时没用）
    fileSet:function(cur,cb){
        fileUrl = [];
        var count = 0;

        $.each(cur,function(i,n){

            convertImgToBase64(n, function(base64Img,isCount){
        
              fileUrl.push(base64Img);

              isCount && (count += 1);
              count == cur.length && (function () {
                cb && cb(fileUrl);
              }());

            },true);  

        });
    },
    //本地添加图片
    setImagePreviews:function(avLalue){
        var fileObj = document.getElementById("file");
        var imgList = document.getElementById("imgList");

        // imgList.innerHTML = "";
        // initArr=[];
        // fileUrl = [];

        var toolsLength = $('.tools-list li').length;
        var fileList = fileObj.files,
            num = 0;

        if (toolsLength+fileList.length>10) {
            screenAlert('添加图片数量不能超过十张！');
            return false;
        }   

        var fileCurArr = [];
        for (var i = 0; i < fileList.length; i++) {    

            (function (j) {
                 
                Console(fileList[j].type);

                if (fileList[j].type=='image/jpeg'||fileList[j].type=='image/png'||fileList[j].type=='image/bmp') {
                }else{
                    screenAlert('上传图片格式只能为/jpg/png/bmp,请重新上传！');
                    return false;
                }

                if ((fileList[j].size/1024/1024)>2) {
                   // screenAlert('上传单张图片大小不能超过2M,请重新上传！');
                   convertImgToBase64(window.URL.createObjectURL(fileObj.files[i]), function(base64Img){
                   
                     imgList.innerHTML += "<li> <img src='" + base64Img + "'  /> </li>";
                     initArr.push(base64Img);

                   });  
                   // return false; 
                }else{
         
                    imgList.innerHTML += "<li> <img id='img" + toolsLength + j + "' src='"+window.URL.createObjectURL(fileObj.files[i])+"' /> </li>";
                    initArr.push(window.URL.createObjectURL(fileObj.files[i]));
                }        

                /*var imgObjPreview = document.getElementById("img" + toolsLength +i);
                
                imgObjPreview.src = window.URL.createObjectURL(fileObj.files[i]);

                initArr.push(imgObjPreview.src);*/

                /*convertImgToBase64(window.URL.createObjectURL(fileObj.files[i]), function(base64Img){
                
                  imgList.innerHTML += "<li> <img src='" + base64Img + "'  /> </li>";
                  initArr.push(base64Img);

                });  */

                /*fileCurArr.push(window.URL.createObjectURL(fileObj.files[i]));

                tools.fileSet(fileCurArr,fileCur);

                function fileCur(url){
                    console.log(fileUrl,'------fileUrl');
                    // imgObjPreview.src = window.URL.createObjectURL(fileObj.files[i]);
                    $('.tools-list li').each(function(i){
                        $(this).find('img').attr(fileUrl[i]);
                    });
                    initArr.push(fileUrl);
                }*/
              
            }(i)); 

            // console.log(JSON.stringify(fileCurArr),'-----fileCurArr');    
        } 

        setTimeout(function(){
            $('dt:nth-child(1)').trigger('click');
        },100);
 
        return true;
    },
    //本地添加图片
    addImg:function(){

        var imgLen = $('.tools-list li').length;
        Console(imgLen);
        $('.tools-content ul li').each(function(){
           initArr.push($(this).find('img').attr('src')); 
        });
    },
    //url载入图片
    loadImg:function(){

        var loadUrl = $('.load-file input').val();
        var Reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;

        if (!Reg.test(loadUrl)||loadUrl.indexOf('58.com')=='-1') {
            screenAlert('请输入正确URL地址，仅限于58生活服务品类！');
            return false;
        };

        $.ajax({
            url:'libs/url.json',
            // url:rootPath + '/pictools/picdownload/download',
            type:'POST',
            data:{
                loadUrl:loadUrl
            },
            dataType:'json',
            beforeSend:function(){
                $('.screen-alert').css('opacity',0);
                $('.screen-bg,.loading').fadeIn(50);
                tools.clearBoth();
                initArr=[];
            },
            success:function(datas){
                $('.screen-alert').css('opacity',1).hide();
                $('.screen-bg,.loading').fadeOut(50);
                var sData = datas.tag;
                // var sData = datas.content;

                if (datas.status==500) {
                    screenAlert('请输入正确URL地址，仅限于58生活服务品类！');
                    return false;
                };

                /*if (datas.status==500) {
                    screenAlert('请输入正确URL地址，仅限于58生活服务品类！');
                    return false;
                }else if(!datas.tag||datas.tag.length<1){
                    screenAlert('当前帖子未包含图片，请输入其他正确URL地址！');
                    return false;
                };*/

                var imgList = document.getElementById("imgList");
                imgList.innerHTML = '';
                $.each(sData,function(i,n){
                    convertImgToBase64(sData[i], function(base64Img){
  
                      imgList.innerHTML += "<li> <img src='" + base64Img + "'  /> </li>";
                      initArr.push(base64Img);

                    });
                    // initArr.push(sData[i]);
                });

            },
            error:function(){
                $('.screen-alert').css('opacity',1).hide();
                $('.screen-bg,.loading').fadeOut(50);

            }
        });
    },
    //清除全部
    clearBoth:function(){
        
        $('dd .sure').addClass('active');
        $('dd:nth-child(2),dd:nth-child(4)').find('select').val('40*30');
        $('dt:nth-child(1)').trigger('click');
        $('.tools-list').empty();
        $('#wmTxt').val('');
        $('#fontFamily').val('Microsoft YaHei');
        $('#fontSize').val('18');
        $('#opacitySel').val('1');
        $('#siteSel').val('upperLeft');
        initArr = [],
        curArr = [],
        saveArr = [];

        var fileObj = document.getElementById("file");
        if (fileObj.outerHTML) {
            fileObj.outerHTML = fileObj.outerHTML;
        } else {
            fileObj.value = '';
        }

        $('.load-file input').val('');
        // $('dd').removeClass('active');
        $('dt').find('mark').hide();
    },
    //保存图片回调转义
    saveUrlStr:function(cur,cb){
        saveUrl = '';
        var count = 0;

        $.each(cur,function(i,n){

            convertImgToBase64(n, function(base64Img,isCount){
        
              saveUrl += base64Img +'--|--';

              isCount && (count += 1);
              count == cur.length && (function () {
                cb && cb(saveUrl);
              }());

            },true);  

        });
    },
    //保存img
    saveImg:function(){

        $('.screen-save,.screen-bg').fadeOut(100);
        var saveCurArr = [];

        $('.tools-list li').each(function(){
            saveCurArr.push($(this).find('img').attr('src'));
        });

        Console(saveCurArr,'----saveimg');

        // if (curArr.length>=1) {
        //     tools.saveUrlStr(curArr,saveCur);
        // }else{
        //     tools.saveUrlStr(initArr,saveCur);
        // }

        //转义回调
        tools.saveUrlStr(saveCurArr,saveCur);

        //回调方法
        function saveCur(url) {
            //字符串截取
            saveUrl = (saveUrl.slice(-5)=='--|--')?saveUrl.slice(0,-5):saveUrl;
            Console(saveUrl,'----url');
            /*var saveData = {
                name:$('#saveName').val(),
                datas:saveUrl
            };*/
            /*$.ajax({
                url:'libs/save.json',
                // url:rootPath + '/pictools/picupload/upload',
                type:'POST',
                data:saveData,
                dataType:'json',
                beforeSend:function(){
                    $('.screen-bg').fadeIn(50);

                },
                success:function(datas){
                    $('#saveName').val('');
                    $('.screen-bg').fadeOut(50);
                    // tools.clearBoth();
                    if (datas.status=='500') {
                        screenAlert('保存状态有误！');
                    }
                    // window.open(datas.tag);
                },
                error:function(){
                    $('.screen-bg').fadeOut(50);
                },
                complate:function(){
                    $('.screen-save .cancle').trigger('click');
                }
            });*/

            var form=$("<form>");//定义一个form表单
            form.attr("style","display:none");
            form.attr("target","");
            form.attr("method","post");
            form.attr("action",rootPath + '/pictools/picupload/upload');
            var inputData=$("<input>");
            inputData.attr("type","hidden");
            inputData.attr("name","datas");
            inputData.attr("value",saveUrl);
            var inputName=$("<input>");
            inputName.attr("type","hidden");
            inputName.attr("name","name");
            inputName.attr("value",$('#saveName').val());
            $("body").append(form);//将表单放置在web中
            form.append(inputData);
            form.append(inputName);
            form.submit();//表单提交
        }
    },
    //确认状态
    markStatus:function(_this,status){
        _this.parents('dd').slideUp(200).prev().removeClass('active').find('mark').css('display',status);
    },
    curSure:function(){
        $('.sure').click(function(){
            $(this).addClass('active');
            // if ($('.tools-list li').length<1) {
            //     return false;
            // }else{
            //     $(".tools-list").empty();

            //     tools.markStatus($(this),'block');
            // }

        });
    },
    curCancle:function(_this){
        $('.sure').click(function(){
            $(this).prev().addClass('active');

        });
        // $(this).parent().find('button').removeClass('active');
       /* $('.cancle').click(function(){
            // tools.markStatus($(this),'none');
            $(this).parents('dd').slideUp(200).prev().removeClass('active').find('mark').hide();
            // fn();
        });*/
    },
    //监听尺寸 返回宽高
    selectSize:function(){
        var selectSize = $('dd.active select option:selected').val().split('*');
        selectSizeW = selectSize[0],
        selectSizeH = selectSize[1];

        return selectSizeW,selectSizeH;  
    },
    //绘制canvas
    convertImageToCanvas:function(image,w,h){
        var canvas = document.createElement("canvas");

        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(image,0,0,w,h);
        return canvas;
    },
    //canvas绘制img
    convertCanvasToImage:function(canvas){
        Console(canvas,'---canvas');
        var image = new Image();
        // image.setAttribute('crossOrigin', 'anonymous');
        image.crossOrigin = 'anonymous';
        image.src = canvas.toDataURL("image/jpeg",0.5);
        return image;
    },
    //上一次图片路径记录
    prevArr:function(){
        $('.tools-list').empty();
        if (prevArr.length>=1) {
            $.each(prevArr,function(i,n){
                $('.tools-list').append('<li><img src="'+n+'"></li>');
            });
            return false;
        };
    },
    //尺寸
    dimensionModify:function(){
        //确认
        $('#dimensionSure').click(function(){
            // 获取宽高
            tools.selectSize();
            Console(selectSizeW,selectSizeH);
            if ($('.tools-list li').length<1) {
                screenAlert('请先添加图片后再操作！');
                return false;
            }else{
                tools.markStatus($(this),'block');
            }

            var canvasHtml = [];
            curArr = [];
            $('.tools-list li').each(function(i){
                // canvasHtml.push(tools.convertImageToCanvas(document.getElementById($(this).find('img').attr('id')),selectSizeW,selectSizeH));
                // canvasHtml.push(tools.convertImageToCanvas(document.getElementsByTagName('img')[1],selectSizeW,selectSizeH));
                // var pre = document.querySelector('#alpha-image span');
                canvasHtml.push(tools.convertImageToCanvas(document.getElementsByTagName('img')[i+1],selectSizeW,selectSizeH));

            });

            $("#canvasHolder").empty().append(canvasHtml);

            var imgHtml = [];
            $.each(canvasHtml,function(i,n){
                var aLi = document.createElement('li');
                aLi.appendChild(tools.convertCanvasToImage(n));
                imgHtml.push(aLi);
                curArr.push(tools.convertCanvasToImage(n).src);
            });

            Console(imgHtml,'----imgHtml');
            $(".tools-list").empty().append(imgHtml);
        });
        //取消
        $('#dimensionCancle').click(function(){
            if ($('.tools-list li').length<1) {
                screenAlert('请先添加图片后再操作！');
                return false;
            }
            $(this).parents('dd').slideUp(200).find('select').val('40*30').end().prev().removeClass('active').find('mark').hide();

            curArr=initArr;
            // tools.prevArr();
            $('.tools-list').empty();
            if (prevArr.length>=1) {
                $.each(prevArr,function(i,n){
                    $('.tools-list').append('<li><img src="'+n+'"></li>');
                });
            }else{
               $.each(initArr,function(i,n){
                   $('.tools-list').append('<li><img src="'+n+'"></li>');
               }); 
            }

        });
    },
    //裁剪
    imgCut:function(){
        //确认
        $('#imgCutSure').click(function(){
            tools.selectSize();
            tools.screenClose();

            if ($('.tools-list li').length<1) {
                screenAlert('请先添加图片后再操作！');
                return false;
            }else{
                tools.markStatus($(this),'block');
            }
            $('dd .sure').addClass('active');

             $('ul').empty();
             $('#ifrmid').hide();
             sessionStorage.isCrop = 0;
            var imgArr = JSON.parse(sessionStorage.imgArr);
            if(imgArr.length<1){
                imgArr = JSON.parse(sessionStorage.cutArr);
            }
            $.each(imgArr,function(i,n){
                 $('ul').append('<li><img src="'+n+'"></li>');
            });
             document.getElementById("ifrmid").contentWindow.cancle();
             sessionStorage.clear(); 
        });
        //取消
        $('#imgCutCancle').click(function(){
            tools.screenClose();
            $(this).parents('dd').slideUp(200).find('select').val('40*30').end().prev().removeClass('active').find('mark').hide();
            // $('.tools-list li').each(function(i){
            //     $(this).find('img').attr('src',prevList.split('--|--')[i]);
            // });

            sessionStorage.clear(); 
            $('.tools-list').empty();
            $('#ifrmid').hide().attr('src','');
            // sessionStorage.initArr = JSON.stringify(initArr);
            
            // tools.prevArr();
            $('.tools-list').empty();
            if (prevArr.length>=1) {
                $.each(prevArr,function(i,n){
                    $('.tools-list').append('<li><img src="'+n+'"></li>');
                });
                return false;
            };
            $.each(initArr,function(i,n){
                 $('.tools-list').append('<li><img src="'+n+'"></li>');
            });
            // sessionStorage.clear(); 
            document.getElementById("ifrmid").contentWindow.cancle();
        });
    },
    //初始化取色器
    picker:function(){
        txtColor = '333';
        $('#picker').colpick({

            colorScheme:'dark',

            layout:'rgbhex',

            color:'333333',

            onSubmit:function(hsb,hex,rgb,el) {

                $(el).css('background-color', '#'+hex);

                $(el).colpickHide();
                txtColor = '#'+hex;
                return hex;
            }

        })

        .css('background-color', '#333');
    },
    getFileUrl:function(sourceId) { 
        var url; 
        if (navigator.userAgent.indexOf("MSIE")>=1) { // IE 
            url = document.getElementById(sourceId).value; 
        } else if(navigator.userAgent.indexOf("Firefox")>0) { // Firefox 
            url = window.URL.createObjectURL(document.getElementById(sourceId).files.item(0)); 
        } else if(navigator.userAgent.indexOf("Chrome")>0) { // Chrome 
            url = window.URL.createObjectURL(document.getElementById(sourceId).files.item(0)); 
        } 
        return url; 
    },
    preImg:function(sourceId, targetId) { 
        var url = tools.getFileUrl(sourceId); 
        var imgPre = document.getElementById(targetId); 
        imgPre.src = url; 
        // return url;
    }, 
    //当前水印位置（暂时没用）
    curWM:function(val,cur){
        var curWM;
        switch(val){
           case 'upperLeft':
               curWM = watermark.cur.upperLeft;
           case 'upperRight':
               curWM = watermark.cur.upperRight;
           case 'center':
               curWM = watermark.cur.center;
           case 'lowerLeft':
               curWM = watermark.cur.lowerLeft;
           case 'lowerRight':
               curWM = watermark.cur.lowerRight;                
        }
    },
    //水印
    watermarkAdd:function(){
        //取色器初始化
        tools.picker();
        //确认
        $('#watermarkSure').click(function(){
            $('dd.active select option:selected').val();

            if ($('.tools-list li').length<1) {
                screenAlert('请先添加图片后再操作！');
                return false;
            }else{
                // tools.markStatus($(this),'block');
            }

            curArr = [];
            $('.tools-list li').each(function(){
                curArr.push($(this).find('img').attr('src'));
            });

            var srcList = curArr;
            var positionVal = $('.site select option:selected').val(),
                opacityVal = $('.opacity select option:selected').val();

            //图片方法
            if ($('.tab .active').html()=='图片') {
                var curWM;
                var watermarkUrl = $('#imgPre').attr('src');
                if (!watermarkUrl||watermarkUrl==null||watermarkUrl==undefined) {
                    screenAlert('请添加水印图片！');
                    return false;
                }
                $(".tools-list").empty();

                Console(watermarkUrl,positionVal);
                if (positionVal=='upperLeft') {
                    curWM = watermark.image.upperLeft;
                } else if(positionVal=='upperRight'){
                    curWM = watermark.image.upperRight;
                } else if(positionVal=='center'){
                    curWM = watermark.image.center;
                } else if(positionVal=='lowerLeft'){
                    curWM = watermark.image.lowerLeft;
                } else if(positionVal=='lowerRight'){
                    curWM = watermark.image.lowerRight;
                } 
                Console(srcList,'----srcList');
                $.each(srcList,function(i,n){
                    watermark([n, watermarkUrl])
                      .image(curWM(opacityVal))
                      .then(function (img) {
                        // var pre = document.querySelector('#alpha-image span');
                        // pre.parentNode.insertBefore(img, pre);
                        aLi = document.createElement('li');
                        aLi.appendChild(img);
                        // imgHtml.push(aLi);
                        $(".tools-list").append(aLi);  
                        curArr.push(img.src);

                    });
                
                });
                // $(".tools-list").empty().append(imgHtml);  

            } else {
                //文字方法
                var curWM;
                var txtVal = $('.tab-txt input').val(),
                    txtFontFamily = $('#fontFamily option:selected').val(),
                    txtFontSize = $('#fontSize option:selected').val();

                if (!txtVal) {
                    screenAlert('请输入水印文字！');
                    return false;
                }
                $(".tools-list").empty();

                Console(txtVal,txtFontFamily,txtFontSize,positionVal,txtColor); 
                if (positionVal=='upperLeft') {
                    curWM = watermark.text.upperLeft;
                } else if(positionVal=='upperRight'){
                    curWM = watermark.text.upperRight;
                } else if(positionVal=='center'){
                    curWM = watermark.text.center;
                } else if(positionVal=='lowerLeft'){
                    curWM = watermark.text.lowerLeft;
                } else if(positionVal=='lowerRight'){
                    curWM = watermark.text.lowerRight;
                } 

                $.each(srcList,function(i,n){
                    watermark([n])
                      // .image(watermark.text.upperRight(txtVal, '50px serif', hex, 0.9))
                      .image(curWM(txtVal, txtFontSize+'px '+txtFontFamily, txtColor, opacityVal))
                      .then(function (img) {
        
                        var aLi = document.createElement('li');
                        aLi.appendChild(img);
                        $(".tools-list").append(aLi);  
                        curArr.push(img.src);

                    });
                });
  
            }
            $('dd .sure').addClass('active');
            tools.markStatus($(this),'block');

        });

        //取消
        $('#watermarkCancle').click(function(){
            var fileObj = document.getElementById("imgOne");
            if (fileObj.outerHTML) {
                 fileObj.outerHTML = fileObj.outerHTML;
            } else {
                 fileObj.value = '';
            };

            $('dd .sure').addClass('active');
            $('#imgPre').attr('src','');
            $('.tab-txt input').val('');
            $('#fontFamily').val('Microsoft YaHei');
            $('#fontSize').val('18');
            $('#opacitySel').val('1');
            $('#siteSel').val('upperLeft');

            $(this).parents('dd').slideUp(200).prev().removeClass('active').find('mark').hide();
            Console(prevArr,'---prevArr');
            // tools.prevArr();
            $('.tools-list').empty();
            if (prevArr.length>=1) {
                $.each(prevArr,function(i,n){
                    $('.tools-list').append('<li><img src="'+n+'"></li>');
                });
            }else{
                $.each(initArr,function(i,n){
                    $('.tools-list').append('<li><img src="'+n+'"></li>');
                });
            };
           
        });
    }
};

