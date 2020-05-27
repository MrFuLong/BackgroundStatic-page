var ids=0;
layui.use('element', function(){
  var $ = layui.jquery
  ,element = layui.element; //Tab的切换功能，切换事件监听等，需要依赖element模块
  //触发事件
  var active = {
    tabAdd: function(){
      //新增一个Tab项
      element.tabAdd('demo', {
        title: '新选项'+ (Math.random()*1000|0) //用于演示
        ,content: '内容'+ (Math.random()*1000|0)
        ,id: new Date().getTime() //实际使用一般是规定好的id，这里以时间戳模拟下
      })
    }
    ,tabDelete: function(id){
      //删除指定Tab项

      element.tabDelete('demo', id); //删除：“商品管理”
      ids=0;
      //othis.addClass('layui-btn-disabled'); 添加样式
    },tabDeleteAll: function(idss){
        $.each(idss, function(i,item) {
             element.tabDelete('demo', item); //删除所有
        });
        ids =0;
    }
    ,tabChange: function(id){
      //切换到指定Tab项
      element.tabChange('demo', id); //切换到：用户管理
    },ltabAdd:function(url,id,name){
                  //新增一个Tab项 传入三个参数，分别对应其标题，tab页面的地址，还有一个规定的id，是标签中data-id的属性值
                    //关于tabAdd的方法所传入的参数可看layui的开发文档中基础方法部分
                    element.tabAdd('demo', {
                        title: name,
                        content: '<iframe data-frameid="'+id+'" scrolling="auto" frameborder="0" src="'+url+'.html" style="width:100%;height:99%;"></iframe>',
                        id: id //规定好的id
                    })
                     CustomRightClick(id); //给tab绑定右击事件
                     FrameWH();  //计算ifram层的大小

    }
  };

    //当点击有site-demo-active属性的标签时，即左侧菜单栏中内容 ，触发点击事件
            $('.site-demo-active').on('click', function() {
                var dataid = $(this);
                //这时会判断右侧.layui-tab-title属性下的有lay-id属性的li的数目，即已经打开的tab项数目
                if ($(".layui-tab-title li[lay-id]").length <= 0) {
                    //如果比零小，则直接打开新的tab项
                    active.ltabAdd(dataid.attr("data-url"), dataid.attr("data-id"),dataid.attr("data-title"));
                } else {
                    //否则判断该tab项是否以及存在

                    var isData = false; //初始化一个标志，为false说明未打开该tab项 为true则说明已有
                    $.each($(".layui-tab-title li[lay-id]"), function () {
                        //如果点击左侧菜单栏所传入的id 在右侧tab项中的lay-id属性可以找到，则说明该tab项已经打开
                        if ($(this).attr("lay-id") == dataid.attr("data-id")) {
                            isData = true;
                        }
                    })
                    if (isData == false) {
                        //标志为false 新增一个tab项
                        active.ltabAdd(dataid.attr("data-url"), dataid.attr("data-id"),dataid.attr("data-title"));
                    }
                }
                //最后不管是否新增tab，最后都转到要打开的选项页面上
                active.tabChange(dataid.attr("data-id"));
            });
  //Hash地址的定位
  var layid = location.hash.replace(/^#test=/, '');
  element.tabChange('test', layid);

  element.on('tab(test)', function(elem){
    location.hash = 'test='+ $(this).attr('lay-id');
  });

    function FrameWH() {
                var h = $(window).height() -41- 10 - 60 -10-44 -23;
                $("iframe").css("height",h+"px");
            }

            $(window).resize(function () {
                FrameWH();
            })


            function CustomRightClick(id) {
                //取消右键  rightmenu属性开始是隐藏的 ，当右击的时候显示，左击的时候隐藏
                $('.layui-tab-title li').on('contextmenu', function () { return false; })
                $('.layui-tab-title,.layui-tab-title li').click(function () {
                    $('.rightmenu').hide();
                    ids=0;
                });

                //桌面点击右击
                $('.layui-tab-title li').on('contextmenu', function (e) {

                    var popupmenu = $(".rightmenu");
                    ids +=1;
                    if(ids >1){
                        return true;
                    }
                    popupmenu.find("li").attr("data-id",id); //在右键菜单中的标签绑定id属性

                    //判断右侧菜单的位置
                    l = ($(document).width() - e.clientX) < popupmenu.width() ? (e.clientX - popupmenu.width()) : e.clientX;
                    t = ($(document).height() - e.clientY) < popupmenu.height() ? (e.clientY - popupmenu.height()) : e.clientY;

                    popupmenu.css({ left: l-190, top: t-50 }).show(); //进行绝对定位
                    //alert("右键菜单")
                    return false;
                });
            }
              $(".rightmenu li").click(function () {
                //右键菜单中的选项被点击之后，判断type的类型，决定关闭所有还是关闭当前。
                if ($(this).attr("data-type") == "closethis") {
                    //如果关闭当前，即根据显示右键菜单时所绑定的id，执行tabDelete

                    active.tabDelete($(this).attr("data-id"));
                } else if ($(this).attr("data-type") == "closeall") {
                    var tabtitle = $(".layui-tab-title li");
                    var ids = new Array();
                    $.each(tabtitle, function (i) {
                        ids[i] = $(this).attr("lay-id");
                    })
                    //如果关闭所有 ，即将所有的lay-id放进数组，执行tabDeleteAll
                    active.tabDeleteAll(ids);
                }else if($(this).attr("data-type") =="closeothe"){
                        var id =$(this).attr("data-id");
                        var tabtitle = $(".layui-tab-title li");
                    var ids = new Array();
                    $.each(tabtitle, function (i) {
                        if(id != $(this).attr("lay-id")){
                        ids[i] = $(this).attr("lay-id");
                       }
                    })
                    active.tabDeleteAll(ids);
                }

                $('.rightmenu').hide(); //最后再隐藏右键菜单
            })

});