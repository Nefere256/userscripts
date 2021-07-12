// ==UserScript==
// @name     Hpoi fan translation
// @namespace https://takkkane.tumblr.com/scripts/hpoiTranslation
// @supportURL     https://twitter.com/TaxDelusion
// @description A script that translates text on Hpoi website to easily navigate
// @version  0.1.6
// @downloadURL	https://raw.githubusercontent.com/Nefere256/userscripts/master/hpoi/fanTranslation.js
// @include  https://www.hpoi.net/*
// @require  https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require  https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js
// @require  https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/locale/zh-cn.min.js
// @require  https://cdnjs.cloudflare.com/ajax/libs/expect/1.10.0/expect.min.js 
// @grant    none
// ==/UserScript==

/* 
Expect library by mjackson https://github.com/mjackson/expect
*/

/* worthy examples:
* working with hpoi: https://github.com/ntzyz/hpoi-info-tgbot/blob/master/src/entry.ts
* tricky html items: https://greasyfork.org/en/scripts/384708-bilibili-danmaku-translator/code
*/

	/* ==== RESOURCES ===== */

const TRANSLATIONS = {
  // 'word' : 'translation'
  en: {
    'nav_top_left_menu' : {
      'GK/DIY' : 'GK/DIY',
    },
    'nav_top_left_submenu' : {
      '分区首页' : 'Home',
      '资料库' : 'Database',
      '相册' : 'Albums',
			'最新发售' : 'Latest releases',
			'最新入库' : 'Newly added',
			'好评' : 'Best rated',
      '再版愿望' : 'Most wished',
      '我的收藏' : 'My collection',
      '上报缺失' : 'Report missing info',
      /* DIY only */
      '原创作品' : 'Made from scratch',
      '灰模上色' : 'Painted',
      '改造' : 'Customs',
      '翻新修复' : 'Repairs',
      '发布' : 'Publish'
    },
    'nav_top_right_menu' : {
      '360°照片' : '360° pics',
      '厂商' : 'Makers',
      '商城' : 'Mall',
    },
    'nav_top_right_get_app' : {
      '下载客户端' : 'Apps',
    },
    'nav_top_right_submenu' : {
      '厂商首页' : 'Home',
  		'我的收藏' : 'My collection',
  		'上报缺失' : 'Report missing info',
      '商品上新' : 'Recent sales',
			'二手专区' : 'Preowned',
      '淘宝自营店' : 'Taobao own shop',
      '淘宝天狗店' : 'Taobao Tengu shop',
    },
    'nav_top_personal' : {
      '个人中心' : 'Profile',
      '我的收藏' : 'Favorites',
      '返现申请' : 'Cashback',
      '好友' : 'Friends',
      '消息' : 'Messages',
      '账号设置' : 'Settings',
      '退出' : 'Logout',
    },
    'nav_top_search_drop_list' : {
      '全部周边' : 'All',
      '角色' : 'Character',
      '作品' : 'Series',
      '系列' : 'Line',
      '人物' : 'Person',
      '厂商' : 'Company',
      '用户' : 'User',
    },
    'nav_top_search_drop_list_default' : {
      '全部周边' : 'All',
    },
    'profile_stats' : {
    	'关注' : 'attention',
    	'粉丝' : 'followers',
    	'赞!' : 'thanks!'
    },
    'profile_desc' : {
			'还没有信仰_(:з」∠)_' : 'not much to say _(:з」∠)_',
    },
    /* HOME PAGE - FEEDS */
    'home_action_type_filter' : {
      '全部' : 'All',
      '情报' : 'Info',
      '相册' : 'Albums',
      '用户' : 'Users',
      '条目' : 'Entries',
    },
    'home_action_type_sub_filter' : {
      '全部' : 'All',
      /*info only*/
      '制作' : 'Announcements',
      '更图' : 'New pics',
      '开订' : 'Preorders',
      '延期' : 'Delays',
      '出荷' : 'Released',
      '再版' : 'Re-releases',
      /* album only */
      '关注' : 'Followed',
      /* entries only */
      '全部条目' : 'All',
      '关注条目' : 'Followed',
    },
    'home_username_info_type' : {
       '制作决定' : 'New item announced',
       '官图更新' : 'Official pictures update',
       '预订时间' : 'Preorders opened',
       '出荷延期' : 'Release postponed',
       '出荷时间' : 'Release time',
       '再版确定' : 'Re-release confirmed',
    },
    'home_edit_action_type' : {
      '传图' : 'Uploaded pics',
      '评论' : 'Comment',
      '出售' : 'Sale',
      '收购' : 'Hunt', /* actually it's buying*/
      '情报' : 'Info',
    },
    'home_image_type_name' : {
      '手办' : 'Figure',
      '动漫模型' : 'A. model',
      '真实模型' : 'R. model',
      '毛绒布偶' : 'Plushie',
      'Doll娃娃' : 'Doll',
      '相册' : 'Album',
      '作品' : 'Series',
    },
    /* TEM PAGE */
    'item_prop' : {
      '名称：' : 'Name:',
      '别名：' : 'Alias:',
      '属性：' : 'Attributes:',
      '定价：' : 'Price:',
      '发售日：' : 'Release date:',
      '发售：' : 'Release:',
      '比例：' : 'Scale:',
      '制作：' : 'Maker:',
      '发行：' : 'Distributor:',
      '系列：' : 'Line:',
      '原型：' : 'Sculptor:',
			'涂装：' : 'Coloring:',
			'原画：' : 'Designer:',
      '角色：' : 'Characters:',
      '作品：' : 'Origin:',
      '版权元：' : "M. copyrights:",
      '素材：' : 'Materials:',
      '材质：' : 'Materials:',
      '数量：' : 'Quantity:',
      '洗涤：' : 'Washing:',
      '尺寸：': 'Size:',
      '版权：' : 'Copyrights:',
			'原型协力：' : 'Producer:',
      '官网：' : 'Website:',
      '官方链接：' : 'Off. links:' ,
      '外部链接：' : 'Ref. links:',
    },
    'item_nav' :  {
    	'概览' : 'Overview',
			'精品摄影' : 'Official photos',
      '用户相册' : 'User albums',
      '传图' : 'Upload pics',
      '报错/催更' : 'Report/remind',
      '编辑' : 'Edit',
      '举报' : 'Review',
  	},
    'rating_label' : {
      '神物' : 'grail',
      '满足' : 'content',
			'眼缘' : 'fated',
      '微妙' : 'so-so',
			'邪神' : 'Cthulhu'
    },
    'item_contribution_type' : {
      '创建' : 'Created',
      '更新资料' : 'Updated info',
      '更新封面' : 'Updated main pic',
      '更新发售/版本' : 'Updated release/version',
  },
    'hpoi_box_title' : {
      /* main page */
      '大家在看' : 'Everyone\'s watching',
      '资料库' : 'Database',
      '最新相册' : 'Recent albums',
      '日亚捡漏' : 'Amazon jp pick up',
      '最新情报' : 'Latest information',
      '热门推荐' : 'Popular recommendations',
      /* items page*/
      '官图·情报' : 'Official information',
      '关联商品' : 'Related products',
      '实物照片' : 'User photos',
      '实物相册' : 'User albums',
      '简评' : 'Brief reviews',
      '关联二手' : 'Selling preowned',
      '贡献用户' : 'Contributors',
      '热门评论' : 'Top comments',
      '最新评论' : 'Recent comments',
      /* user main page*/
      '待补款' : 'Waiting to pay',
      '商品推荐' : 'Featured products',
      '红人榜' : 'Top contributors', /*lit. red people list */
    },
    'more_button' : {
      '更多' : 'more',
    	'换一换' : 'refresh',
      '新建相册' : 'new album',
      '写简评' : 'new review',
      '添加' : 'add'
    },
    'home-page-searchbox' : { /* 请输入关键/条目ID/JAN码等 如: GSC 路人女主 */
      'placeholder' : 'Please enter the keyword / entry ID / JAN code etc. like: POP UP PARADE',
    },
    'search-searchbox' : { /*在结果中查找*/
      'placeholder' : 'Search within the results'
    },
    'search_filter_button_group' : {
      '排序' : 'Sort by',
      '筛选' : 'Filter',
      '设置' : 'Display',
    },
    'search_filter_button_group_sort' : {
    	'发售' : 'Release date',
      '入库' : 'Added date',
      '总热度' : 'Hits in total',
      '一周热度' : 'Hits in a week',
      '一天热度' : 'Hits today',
      '评价' : 'Rating'
    },
    'search_filter_button_group_out' : {
      '汉子' : 'Male',
      '妹子' : 'Female',
      '景品' : 'Prizes',
      '军用' : 'Military',
      'GK' : 'Garage kits',
      '可变形' : 'Deformed',
      '民用' : 'Civil',
      '海上' : 'Maritime',
      '可动' : 'Movable',
      '陆地' : 'On land',
      '航空' : 'Aircraft',
      '可脱' : 'Alternate parts',
      '需拼装' : 'To assembly',
      '未上色' : 'Uncolored',
    },
    'search_filter_button_group_out_scale' : {
      '比例' : 'Scale: ',
    },
    'search_filter_button_group_out_rating' : {
      '限制' : 'Rating: ',
    },
    'search_filter_button_group_out_rating_list' : {
      '不限' : 'All',
      '全年龄' : 'All ages',
      'R15' : 'R15',
      'R18' : 'R18',
      'R18+' : 'R18+',
      'R15以下' : 'R15 and less',
      'R18以下' : 'R18 and less',
			'R15以上' : 'R15 and above',
			'R18以上' : 'R18 and above',
    },
    'search_filter_button_group_out_type' : {
      '类型' : 'Type: ',
    },
    'search_filter_button_group_out_type_list' : {
      '全部' : 'All',
      '其它' : 'Other',

      '比例人形' : 'Scale figure',
      'Q版人形' : 'Chibi figure',
      '盒蛋/扭蛋' : 'Blind box/gacha',
      '怪兽/机械' : 'Monster/mecha',
      '仿真人物' : 'Real person',
      '配件' : 'Accessory',
      '场景' : 'Diorama',

      '机甲-拼装' : 'Mecha - to assembly',
      '机甲-完成品' : 'Mecha - completed',
      '机甲-配件' : 'Mecha - accessory',
      '特摄英雄' : 'Tokusatsu hero',
      '特摄怪兽' : 'Tokusatsu monster',
      '特摄配件' : 'Tokusatsu accessory',
      '扭蛋/玩具' : 'Gacha/toy',
      '驱动模型(四驱车)' : 'Vechicle (4 wheels)',
      '驱动模型配件' : 'Vechicle accessory',

      '拼装' : 'To assembly',
      '完成品' : 'Completed',
      '人形' : 'Person',
      '场景配件' : 'Diorama accessory',
      '工具材料' : 'Tool',

      '拟人形' : 'Anthropomorphic',
      '动植物' : 'Flora and fauna',
      
      'Doll完成品' : 'Complete doll'
    },
    'search_filter_button_group_out_view' : {
      '视图' : 'View'
    },
    'search_filter_button_display_icon_list' : {
      '超小' : 'Very small',
      '小' : 'Small',
      '中' : 'Medium',
      '大' : 'Large',
      '超大': 'Very large',
    },
    'search_filter_more_filters_button_list' : {
      '厂商' : 'Manufacturer',
  		'系列' : 'Line',
			'作品' : 'Series',
      '角色' : 'Character',
      '发售时间' : 'Release time',
      '发售' : 'Release',
      '入库时间' : 'Warehouse time',
    },
    'search_page_ibox' : {
    	'更多条件' : 'More filters',
    	'热门厂商' : 'Top manufacturers',
    	'发售时间表' : 'Release date',
  	},
    'search_item_props' : {
      '厂商' : 'Man', // manufacturer
      '出荷' : 'Rele.', // Release date
      '新增' : 'Add.', // Addition date
      '价格' : 'Price', // Price
      '愿望' : 'Wish', // Wished by x people
      '浏览' : 'Hits', // how many views
      '评分' : 'Rate', // overal rate
      //collection only
      '途径' : 'Way', // channel? shop? shipment?
      '补款' : 'Due', // how many money yet to paid
      // line only
      '名称' : 'Name',
      '作品' : 'Count',
      '更新' : 'Upd.',
    },
    'search_modal_window_header' : {
      '选择时间' : 'Select date period',
    },
    'search_modal_window_body' : { 
      '开始：' : 'Start: ',
      '结束：' : 'End: ',
    },
    'search_modal_window_footer' : {
      '确定' : 'OK',
    },
    
    /* Global search */
    'search_global_advanced_search_button' : {
      '高级检索' : 'Advanced',
    },
    
    'search_global_main_nav' : {
      '周边' : 'Items',
      '图片' : 'Pictures',
			'相册' : 'Albums',
      '角色' : 'Chars',
      '作品' : 'Series',
      '系列' : 'Lines',
      '人物' : 'Persons',
      '厂商' : 'Makers',
      '用户' : 'Users',
    },
    'search_global_tags_additional' : {
      '周边系列' : 'Line', // text for global search tags
      '手办相册' : 'Figure album',
      '动漫周边' : 'Merch',
    },
    'search_global_option_title' : {
      '综合排序' : 'Complex search',
      '全部周边' : 'All types',
      '全部手办' : 'All figures',
      '全部动漫模型' : 'All anime models',
      '全部真实模型' : 'All real models',
      '全部毛绒布偶' : 'All plushies',
      '全部Doll娃娃' : 'All dolls',
      '立牌/摆件' : 'Character stand',
      '全部厂商' : 'All companies',
      '不限年份' : 'Any year',
    },
    'search_global_option_sort' : {
      '相关度最高' : 'Most revelant',
      '最热门' : 'Popular first',
      '最新添加' : 'Newly added',
      '最晚发售' : 'Latest released',
      '评分最高' : 'Best rated',
    },
    'search_global_results_none' : {
      '什么也没找到, 可以尝试按"相关度最高"排序看看' : 'Couldn\'t find anything, try to sort by \'Most revelant\'.',
    },
    'search_global_page_ibox' : {
      '说明' : 'How to use',
      '大家在找' : 'Most popular',
    },
    'search_global_ibox_description' : {
      '1、尽量用日语原文作关键字，因为很多还没翻译，或者翻译不标准' : '1. If possible, use Japanese names to search over Chinese ones, as not all items are translated, or Chinese names are not common.',
      '2、分类、排序、样式都还要完善，先用着吧_(:з」∠)_' : '2. Sorting and filtering by types and all clasifications are your friends, use them first _(:з」∠)_',
      '3、如果要按性质(如可脱)查找，也可以看看' : '3. If you want more detailed filtering (like for figures with alternate parts), take a look at ',
      '高级检索' : 'an advanced search.',
    
    },
    
    /* Encyclopedia */
    'encyclopedia_nav' : {
      '概述' : 'Overview',
      '作品' : 'Works',
      '关联作品' : 'Related works',
      '参与作品' : 'Works',
      '用户收藏' : 'User favs',
      '编辑' : 'Edit',
      '推送动态' : 'Push action',
      '加入收藏' : 'Add to favs',
      '取消收藏' : 'Remove from favs',
    },
    'encyclopedia_infobox_props' : {
      '名称:' : 'Name:',
      '中文名:' : 'Chinese name:',
      '别名:' : 'Aliases:',
      '官网:' : 'Website:',
      '官方网站:' : 'Official website:',
      '官方微博:' : 'Official Weibo:',
      '推特:' : 'Twitter',
      
      '成立时间:' : 'Founded date:',
      '所在地:' : 'Location:',
      
      '性别:' : 'Sex:',
      '生日:' : 'Birthday date:',
      '家庭情况:' : 'Family info:',
      '前任监护人:' : 'Former guardian:',
      '监护人:' : 'Guardian:',
      '血型:' : 'Blood type:',
      '引用来源:' : 'Info source:',
      'Anidb ID:' : 'Anidb ID:',
      '母亲:' : 'Mother:',
      '学籍:' : 'Student status:',
      '种族:' : 'Race:',
      '身高:' : 'Height:',
      '年龄:' : 'Age:',
      '体重:' : 'Weight:',
      '三围:' : 'Body meas.:',
      '出生地:' : 'Place of birth:',
      '国籍:' : 'Nationality:',
      '声优:' : 'Voice actor:',
      '音源:' : 'Voice provider:',
      
      '类型:' : 'Type:',
      '时间:' : 'Time:',
      '话数:' : 'Episodes:',
      '放送星期:' : 'Week day of stream.:',
      '发行日期:' : 'Released:',
      '开发:' : 'Developed:',
    },
    'encyclopedia_series_types' : {
      '动画' : 'Video',
      '游戏' : 'Game',
      '其它' : 'Other',
    },
    'encyclopedia_items_section' : {
      '最新作品' : 'Latest items',
      '关联手办' : 'Related figures',
      '系列' : 'Lines',
      '制作周边' : 'Items manufactured',
      '发行周边' : 'Items distributed',
      '她参与的手办' : 'Figures worked on',
      '他参与的手办' : 'Figures worked on',
    },
    'encyclopedia_items_more' : {
      '查看更多' : 'see more',
    },
    
    
// types (filter)
    'x_generic_all' : {
      '全部' : 'all',
      '不限' : 'all', // actualy - non required
      '周边' : 'all',
    },
		
    '其它' : 'other',
  
  /* SORTED DIC */
    'x_item_types' : {
      '手办' : 'Figure',
      '动漫模型' : 'Anime model',
      '真实模型' : 'Real model',
      '毛绒布偶' : 'Plushie',
      'Doll娃娃' : 'Doll',
      '动漫周边' : 'Merch',
    }, 
    'x_item_types_plural' : {
      '手办' : 'Figures',
      '动漫模型' : 'Anime models',
      '真实模型' : 'Real models',
      '毛绒布偶' : 'Plushies',
      'Doll娃娃' : 'Dolls',
    },
    'x_subtypes_figures' : {
			'比例人形' : 'Scale figure',
      'Q版人形' : 'Chibi figure',
      '盒蛋/扭蛋' : 'Blind box/gacha',
      '怪兽/机械' : 'Monster/mecha',
      '仿真人物' : 'Real person',
      '配件' : 'Accessory',
      '场景' : 'Diorama',
    },
    'x_subtypes_anime_models' : {
      '机甲-拼装' : 'Mecha - to assembly',
      '机甲-完成品' : 'Mecha - completed',
      '机甲-配件' : 'Mecha - accessory',
      '特摄英雄' : 'Tokusatsu hero',
      '特摄怪兽' : 'Tokusatsu monster',
      '特摄配件' : 'Tokusatsu accessory',
      '扭蛋/玩具' : 'Gacha/toy',
      '驱动模型(四驱车)' : 'Vechicle (4 wheels)',
      '驱动模型配件' : 'Vechicle accessory',
    },
    'x_subtypes_real_models' : {
      '拼装' : 'To assembly',
      '完成品' : 'Completed',
      '人形' : 'Person',
      '场景配件' : 'Diorama accessory',
      '工具材料' : 'Tool',
    },
    'x_subtypes_plushies' : {
      '人形' : 'Human',
      '拟人形' : 'Anthropomorphic',
      '动植物' : 'Flora and fauna',
    },
    'x_subtypes_dolls' : {
      'Doll完成品' : 'Complete doll',
		},
    'x_subtypes_merch' : {
      '立牌/摆件' : 'Character stand',
      '箱包鞋服' : 'Bags and shoes',
      '穿戴配饰' : 'Clothes',
      '徽章/挂件' : 'Badges / keychains',
      '海报/装饰画' : 'Artworks',
      '抱枕/家纺' : 'Daily use / stationery',
      '日用/文具' : 'Linens',
      '数码/配件' : 'Digital / accesories',
      '拼图纸膜' : 'Papercraft',
      '其它周边' : 'Other merch',
    },
    'x_other' : {
    	'其它' : 'Other',
      '其他' : 'Other',
    },
  }
};

  
const PLACES = {
  /* NAV TOP BAR */
  'nav_top_left_menu'	: '.hpoi-nav-tabbox > .nav-conters-left > li > a',
  'nav_top_left_submenu'	: '.hpoi-nav-tabbox > .nav-conters-left > li > .hpoi-garagekit-box  > li > a',
  'nav_top_right_menu'	: '.hpoi-nav-tabbox > .nav-conters-right > li > a',
  'nav_top_right_get_app'	: 'html body nav.nav-conters div.hpoi-nav-tabbox ul.nav-conters-right li div.icon_Mobile_phone span',
  'nav_top_right_submenu'	: '.hpoi-nav-tabbox > .nav-conters-right > li > .hpoi-garagekit-box  > li > a',
  'nav_top_personal'	: '.hpoi-navpersonals > .hpoi-navpersonal > li > a',
  'nav_top_search_drop_list'	: '.nav-conters-right .dropdown-menu > li > a',
  'nav_top_search_drop_list_default'	: '#searchItemTypeText',
  /* OTHER */
  'hpoi_box_title'	: 'div.hpoi-box-title > .hpoi-title-left span',
  'profile_stats'	: '.user-box-content > .row > div',
  'profile_desc'	: '.user-box-content-detail > small',
  /* HOME PAGE */
  'home_action_type_filter'	: 'div.user-home div.action-type ul.action-type-nav > li > a',
  'home_action_type_sub_filter'	: 'div.user-home div.action-type ul.action-sub-nav > li > a',
  'home_edit_action_type'	: '.home-info .home-info-content span.type-action',
  'home_username_info_type'	: 'div.home-info > .row > .home-info-content div:not(.has-user) > .user-name',
  'home_image_type_name'	: '.home-info .type-name',
  /* SEARCH PAGE*/
  'search_page_ibox'	: '.ibox > .ibox-title > h5',
  'search_item_props'	: 'ul.bs-glyphicons-list > li.detail-grid .detail-grid-info em',
  'search_filter_button_group'	: 'div[aria-label="条件"] > div > button.btn-info',
  'search_filter_button_group_sort' :  'div[aria-label="order"] > button.btn-default',
  'search_filter_button_group_out' :  'div[aria-label="out"] > button.btn-default',
  'search_filter_button_group_out_scale' : 'div[aria-label="out"] .btn-group:first > button',
  'search_filter_button_group_out_scale_all' : 'div[aria-label="out"]:first .btn-group:first> ul > li:first > a',
  'search_filter_button_group_out_rating' : 'div[aria-label="out"] .btn-group:nth-of-type(2) > button',
  'search_filter_button_group_out_rating_list' : 'div[aria-label="out"] .btn-group:nth-of-type(2) > ul > li > a',
  'search_filter_button_group_out_type' : 'div[aria-label="out"] .btn-group:nth-of-type(3) > button',
  'search_filter_button_group_out_type_list' : 'div[aria-label="out"] .btn-group:nth-of-type(3) > ul > li > a',
  'search_filter_button_group_out_view' : 'div[aria-label="out"] .btn-group:last > button',
  'search_filter_button_display_icon_list' : 'div[aria-label="out"]:last li > a',
  'search_filter_more_filters_button' : '.ibox-tools > div > button.dropdown-toggle',
  'search_filter_more_filters_button_list' : '.ibox-tools > div > ul > li > a',
  'search_filter_more_filters_list' : '.ibox > .ibox-content > .list-group:first > .list-group-item',
  'search_modal_window_header' : '#selectDateModal .modal-header > h4.modal-title',
  'search_modal_window_body' : "#selectDateModal .modal-body label",
  'search_modal_window_footer' : "#selectDateModal .modal-footer > button",
  /* global search */
  'search_global_advanced_search_button' : 'div.page-search-btn ~ a.btn-link',
  'search_global_main_nav' : 'div.taobao-nav > div',
  'search_global_option_title' : '.search-option-nav > div:nth-of-type(1)',
  'search_global_option_nav' : '.search-option-nav',
  'search_global_option_sort' : '.search-option-nav:nth-of-type(3) > div:not(:nth-of-type(1))',
  'search_global_option_item_types' : '.search-option-nav:nth-of-type(4) > div:not(:nth-of-type(1))',
  'search_global_option_item_type_active' : '.search-option-nav:nth-of-type(4) > div.active',
  'search_global_option_item_subtypes' : '.search-option-nav:nth-of-type(5) > div:not(:nth-of-type(1))',
  'search_global_result_tags' : '#result-content > .media-list .ibox-content > .media-body > div > span.label-tag',
  'search_global_users_stats' : '#result-content .user-i-box .row > div',
  'search_global_results_none' : 'div#result-content > div:not(.pull-right)',
  'search_global_page_ibox'	: '.ibox > .ibox-title > h5',
  'search_global_ibox_description' : '.ibox:first > .ibox-content  *',
  /* ENCYCLOPEDIA */
  'encyclopedia_nav' : 'nav.navbar-inner > ul > li > a',
  'encyclopedia_infobox_props' : 'table.info-box td.info-box-left',
  'encyclopedia_items_more' : '.subfield a',
  'encyclopedia_items_section' : '.subfield span',
  
  
  /* OTHER */
  'item_prop'	: '.hpoi-ibox-content > .infoList-box > .hpoi-infoList-item > span',
  'item_contribution_type'	: 'div.hpoi-user-content > div',
  'item_nav'	: '.navbar-header > ul.navbar-nav > li > a',
  'more_button'	: '.hpoi-btn-border > span',
  'rating_label'	: '.rating-bar-chart > .graphFieldrating_barchart > .graphLabelrating_barchart',
  'home-page-searchbox'	: '.home-search-text',
  'search-searchbox'	: '#realPage-keyword',
};
  

 /* ==== TRANSLATE ===== */

/* 
* itemInQuestion - name of the jsquery selector/dictionary
* subDictionaries - list of disctionaries, used in dic_first method only
* methodType - 'item_first' - replace the exact string appearing in itemInQuestion results
		- 'dic_first' - check all keys listed in subDictionaries and replace them with translations stored in values
*/
const doTranslation = function(itemInQuestion, subDictionaries = [], methodType = 'item_first', elementsInQuestion) {
  if (subDictionaries.length) {
    methodType = 'dic_first';
  }
  let items;
  if(!elementsInQuestion)
  	items = $(PLACES[itemInQuestion]);
  else
    items = elementsInQuestion;
  
  let textItems = items.contents().filter(function() {
    return this.nodeType === Node.TEXT_NODE;
  });
  
  textItems.each(function(i,e) {
    if (methodType == 'item_first') {
      let bad = e.textContent.trim();
			let translation = TRANSLATIONS.en[itemInQuestion][bad];
  		if (translation) {
        e.textContent = translation;
      }
    } else if (methodType == 'dic_first') {
      let translationDone = 0;
      e.textContent = e.textContent.trim();
      let toTranslate = e.textContent;
      for(const subDictionary of subDictionaries) {
        for(const subDictionaryEntry of Object.entries(TRANSLATIONS.en[subDictionary])) { /*[0] key [1] value*/
          e.textContent = toTranslate.replace(subDictionaryEntry[0], subDictionaryEntry[1]);
          if (e.textContent != toTranslate) {
            translationDone = 1;
            break;
          }
        }
        if (translationDone) {
          break;
        } 
      }
    }
  });
};

const doDateFormat = function(dateCn) {
  let date = moment(dateCn, "YYYY年MM月DD日");
  let dateEn = date.format("DD/MM/YYYY");
  return dateEn;
};

const translateFixedDate = function(cnDateElements) {
    cnDateElements.each(function(i,e) {
      let bad = e.textContent.trim();
      if (bad == '未知' ) {
        e.textContent = 'Unknown';
      } else {
      	e.textContent  = (doDateFormat(bad));
      }
      });
};

const translateRelativeDate = function(datesTextesReleaseDate) {
    datesTextesReleaseDate.each(function(i,e) {
      let bad = e.textContent.trim();
      let good = bad;
			if (bad == "刚刚")
        good = "just now";
			else if (bad == "1分钟前")
        good = "a minute ago";
      else if (bad.includes('分钟前'))
        good = bad.replace("分钟前", " minutes ago");
      else if (bad == "1小时前")
        good = "an hour ago";
      else if (bad.includes('小时前'))
        good = bad.replace("小时前", " hours ago");
      else if (bad == "1天前")
        good = "a day ago";
      else if (bad.includes('天前'))
        good = bad.replace("天前", " days ago");
      else if (bad == "1个月前")
        good = "a month ago";
      else if (bad.includes('个月前'))
        good = bad.replace("个月前", " months ago");
      else if (bad == "1年前")
        good = "a year ago";
      else if (bad.includes('年前'))
        good = bad.replace("年前", " years ago");
      else
        console.log("unresolved relative date [" + bad + "]");
      e.textContent = good;
		});
};

  /* do stuff to translate text like
  系列 共13个 => Lines, total of 13
  系列 共4个 => Lines, total of 4
  制作周边 共596个, 评分4.44 => Made works, total of 596, rating 4.44
  制作周边 共220个, 评分4.33 => Made works, total of 220, rating 4.33
  发行周边 共297个 => Distributed works, total of 220
  发行周边 共1个 => Distributed works, total of 1
  她参与的手办 共110个, 评分4.43 => Figures worked on, total of 110, rating 4.43
  他参与的手办 共288个, 评分4.38 => Figures worked on, total of 288, rating 4.38
  
  so
  * 1st part - get before Chinese space, translate it as dic sugessts
  * 2nd part - optional if space exists, get between Chinese space and coma (or end of string, if it comes), get a number and add the text
  * 3rd part - optional, after the coma, get a number and add the text
  */
  let translateEncyclopediaItemsHeader = function(element, dic) {
    let textToTranslate = element.textContent.trim();
    let translation = "";
    let secondPartExists = textToTranslate.indexOf(" ") != -1;
    let title = "";
   // * 1st part - get before Chinese space, translate it as dic sugessts
    if (secondPartExists) {
    	title = textToTranslate.substring(0, textToTranslate.indexOf(" "));
    } else {
      title = textToTranslate;
    }
    
    let titleTranslation = TRANSLATIONS.en[dic][title];
    
    if (!titleTranslation)
      return;
    
    translation += TRANSLATIONS.en[dic][title];
    
    if (secondPartExists) {
    
      //* 2nd part - optional if space exists, get between Chinese space and coma (or end of string, if it comes), get a number and add the text
     //* 3rd part - optional, after the coma, get a number and add the text
      let thirdPartExists = textToTranslate.indexOf(",") != -1;
      let total = null;
      let rating = null;
      if (thirdPartExists) {
        total = textToTranslate.substring(textToTranslate.indexOf(" ") + 2, textToTranslate.indexOf(",") - 1);
        rating = textToTranslate.substring(textToTranslate.indexOf(",") + 4);
      } else {
        total = textToTranslate.substring(textToTranslate.indexOf(" ") + 2, textToTranslate.length - 1);
      }
      
      translation += ", total of " + total;
      if (thirdPartExists) {
        translation += ", average rating " + rating;
      }
    }
    element.textContent = translation;
    
  };

/* ==== TESTS ===== */

const testTranslationMap = function (submapToCheck) {
  expect(PLACES[submapToCheck]).toExist("jquery for [" + submapToCheck + "] should exists.");
  expect($(PLACES[submapToCheck])).toExist("items found via jquery for [" + submapToCheck + "] should exist.");
  $(PLACES[submapToCheck]).each(function(i,e) {
    expect(Object.values(TRANSLATIONS.en[submapToCheck]).find(translation => translation.includes(e.textContent.trim())))
      .toBeTruthy("No translation provided for [" + e.textContent + "] in [" + submapToCheck + "] map!");
  });
};

const testTranslationMapForDic = function (placeToCheck, dictionaries) {
  expect(PLACES[placeToCheck]).toExist("jquery for [" + placeToCheck + "] should exists.");
  expect($(PLACES[placeToCheck])).toExist("items found via jquery for [" + placeToCheck + "] should exist.");
  
  $(PLACES[placeToCheck]).each(function(i,e) {
    let translationIsDone = 0;
    let translatedText = e.textContent.trim();
    for(const subDictionary of dictionaries) {
      for(const subDictionaryEntry of Object.entries(TRANSLATIONS.en[subDictionary])) { /*[0] key [1] value*/
        translationIsDone = translatedText.includes(subDictionaryEntry[1]);
        if (translationIsDone) {
          break;
        }
      }
      if (translationIsDone) {
        break;
      }
    }
    expect(translationIsDone).toBeTruthy(
    	"No translation provided for [" + translatedText + "] in [" + dictionaries.join() + "] maps!");
  });
  
};


$(document).ready(function () {
	console.log('translating starting...');
  
  doTranslation('nav_top_left_menu', ['x_item_types_plural', 'nav_top_left_menu']);
  doTranslation('nav_top_left_submenu');
  $('.hpoi-garagekit-box').css('width', '178px').css('margin-left', '-86px');
  doTranslation('nav_top_right_menu');
  doTranslation("nav_top_right_get_app");
  doTranslation("nav_top_right_submenu");
  doTranslation("nav_top_personal");
  doTranslation('nav_top_search_drop_list', ['nav_top_search_drop_list', 'x_item_types']);
  doTranslation('nav_top_search_drop_list_default');
  doTranslation('hpoi_box_title');
  
  doTranslation('profile_stats');
  doTranslation('profile_desc');
  doTranslation('home_action_type_filter');
  doTranslation('home_action_type_sub_filter');
  doTranslation('home_edit_action_type');
  $(PLACES['home_edit_action_type']).prev().css('width', '60%');
  doTranslation('home_username_info_type');
  doTranslation('home_image_type_name');
	doTranslation('item_prop');
  doTranslation('item_nav');
  if(window.location.pathname.includes("/hobby/")) {
     doTranslation('item_contribution_type', ['item_contribution_type']);
  }
  doTranslation('rating_label');
	doTranslation('more_button');
	doTranslation('search_item_props');
  if (window.location.pathname.includes('/hobby/all')) { // item search page
		doTranslation('search_page_ibox');
    doTranslation('search_filter_button_group');
    doTranslation('search_filter_button_group_sort');
    doTranslation('search_filter_button_group_out');
    doTranslation('search_filter_button_group_out_scale', ['search_filter_button_group_out_scale']);
    doTranslation('search_filter_button_group_out_scale', ['x_generic_all']);
    doTranslation('search_filter_button_group_out_scale_all', ['x_generic_all']);
    doTranslation('search_filter_button_group_out_rating', ['search_filter_button_group_out_rating']);
    doTranslation('search_filter_button_group_out_rating', ['search_filter_button_group_out_rating_list']);
    doTranslation('search_filter_button_group_out_rating_list');
    doTranslation('search_filter_button_group_out_type', ['search_filter_button_group_out_type']);
    doTranslation('search_filter_button_group_out_type', ['x_item_types', 'search_filter_button_group_out_type_list', 'x_generic_all']);
    doTranslation('search_filter_button_group_out_type_list', ['x_item_types', 'search_filter_button_group_out_type_list']);
    doTranslation('search_filter_button_group_out_view', ['search_filter_button_group_out_view']);
    doTranslation('search_filter_button_display_icon_list');
    doTranslation('search_filter_more_filters_button', ['more_button']);
    doTranslation('search_filter_more_filters_button_list');
    doTranslation('search_filter_more_filters_list', ['search_filter_more_filters_button_list']);
    doTranslation('search_modal_window_header');
    doTranslation('search_modal_window_body');
    doTranslation('search_modal_window_footer');
    
  }
  if (window.location.pathname.includes('/search')) {
    doTranslation('search_global_advanced_search_button');
    doTranslation('search_global_main_nav');
    
    // search
    var nav_option_groups = $(PLACES['search_global_option_nav']);
    doTranslation('search_global_option_title');
    doTranslation('search_global_option_sort');
    doTranslation('search_global_option_item_types', ['x_item_types_plural','x_other']);
    
    let activeSubtype = $(PLACES['search_global_option_item_type_active']);
    let dicToTranlateSubtypes = "";
    if (activeSubtype.length) {
      var subtype = activeSubtype[0].innerText.trim();
      switch (subtype) {
          case 'All types':
          break;
          case 'Figures' : 
          dicToTranlateSubtypes = 'x_subtypes_figures';
          break;
          case 'Anime models' : 
          dicToTranlateSubtypes = 'x_subtypes_anime_models';
          break;
          case 'Real models' : 
          dicToTranlateSubtypes = 'x_subtypes_real_models';
          break;
          case 'Plushies' : 
          dicToTranlateSubtypes = 'x_subtypes_plushies';
          break;
          case 'Dolls' : 
          dicToTranlateSubtypes = 'x_subtypes_dolls';
          break;
        case 'Other' :
          dicToTranlateSubtypes = 'x_subtypes_merch'
          break;
      }
    } else {
      dicToTranlateSubtypes = 'x_subtypes_merch';
    }
    if(dicToTranlateSubtypes != "") {
      doTranslation('search_global_option_item_subtypes', [dicToTranlateSubtypes, 'x_other']);
    }

    doTranslation('search_global_result_tags', ['search_global_tags_additional','nav_top_search_drop_list',
                                                'encyclopedia_series_types', 'home_image_type_name']);
    doTranslation('search_global_users_stats', ['profile_stats']);
    doTranslation('search_global_results_none');
    doTranslation('search_global_page_ibox');
    doTranslation('search_global_ibox_description');
  }
  
  doTranslation('encyclopedia_nav');
  doTranslation('encyclopedia_infobox_props');
  
  $(PLACES['encyclopedia_items_section']).each(function(index, element) {
    translateEncyclopediaItemsHeader(element, 'encyclopedia_items_section');
  });
  
  doTranslation('encyclopedia_items_more');
  
  
  let datesCnReleaseDate = $('.hpoi-ibox-content > .infoList-box > .hpoi-infoList-item > span:contains("date")').siblings('p').children('a');
  let datesTextesReleaseDate = datesCnReleaseDate.contents().filter(function() {
    return this.nodeType === Node.TEXT_NODE;
  });
  translateFixedDate(datesTextesReleaseDate);
  
  let relativeTimes = $('span.type-time');
  translateRelativeDate(relativeTimes);
  
  //translate home search placeholder
  var searchboxes = $(PLACES['home-page-searchbox']);
  for(const searchbox of searchboxes) {
   	searchbox.attributes['placeholder'].textContent = 
      TRANSLATIONS.en['home-page-searchbox']['placeholder'];
  }
  var searchboxes2 = $(PLACES['search-searchbox']);
  for(const searchbox of searchboxes2) {
   	searchbox.attributes['placeholder'].textContent = 
      TRANSLATIONS.en['search-searchbox']['placeholder'];
  }

  console.log('translating completed');
	console.log('tests starting...');

  try {
    expect(TRANSLATIONS).toExist("TRANSLATIONS is empty!");
    expect(TRANSLATIONS.en).toExist("English is somehow empty!");

    testTranslationMapForDic("nav_top_left_menu", ['x_item_types_plural', 'nav_top_left_menu']);
    testTranslationMap("nav_top_left_submenu");
    testTranslationMap("nav_top_right_menu");
    testTranslationMap("nav_top_right_get_app");
    testTranslationMap("nav_top_right_submenu");
  	testTranslationMap("nav_top_personal");
  	testTranslationMapForDic('nav_top_search_drop_list', ['nav_top_search_drop_list', 'x_item_types']);
    //testTranslationMap('nav_top_search_drop_list_default');
    testTranslationMap('hpoi_box_title');
		testTranslationMap('search_item_props');
    if (window.location.pathname.includes('/hobby/all')) {
      testTranslationMap('search_page_ibox');
      testTranslationMap('search_filter_button_group');
      testTranslationMap('search_filter_button_group_sort');
      testTranslationMap('search_filter_button_group_out');
      testTranslationMapForDic('search_filter_button_group_out_scale', ['search_filter_button_group_out_scale']);
      testTranslationMapForDic('search_filter_button_group_out_scale', ['x_generic_all']);
      testTranslationMapForDic('search_filter_button_group_out_scale_all', ['x_generic_all']);
      testTranslationMapForDic('search_filter_button_group_out_rating', ['search_filter_button_group_out_rating']);
      testTranslationMapForDic('search_filter_button_group_out_rating', ['search_filter_button_group_out_rating_list']);
      testTranslationMap('search_filter_button_group_out_rating_list');
      testTranslationMapForDic('search_filter_button_group_out_type', ['search_filter_button_group_out_type']);
      testTranslationMapForDic('search_filter_button_group_out_type',  ['x_item_types', 'search_filter_button_group_out_type_list', 'x_generic_all']);
      testTranslationMapForDic('search_filter_button_group_out_type_list', ['x_item_types', 'search_filter_button_group_out_type_list']);
      testTranslationMapForDic('search_filter_button_group_out_view', ['search_filter_button_group_out_view']);
      testTranslationMap('search_filter_button_display_icon_list');
    	testTranslationMapForDic('search_filter_more_filters_button', ['more_button']);
      testTranslationMap('search_filter_more_filters_button_list');
    	testTranslationMapForDic('search_filter_more_filters_list', ['search_filter_more_filters_button_list']);
    	testTranslationMap('search_modal_window_header');
    	testTranslationMap('search_modal_window_body');
    	testTranslationMap('search_modal_window_footer');
      
      
    }
    if (window.location.pathname.includes('/search')) {
      testTranslationMap('search_global_advanced_search_button');
      testTranslationMap('search_global_main_nav');
      testTranslationMapForDic('search_global_result_tags', ['search_global_tags_additional','nav_top_search_drop_list',
                                                'encyclopedia_series_types', 'home_image_type_name']);
      testTranslationMapForDic('search_global_users_stats', ['profile_stats']);
      testTranslationMap('search_global_results_none');
    	testTranslationMap('search_global_page_ibox');
      testTranslationMap('search_global_ibox_description');
  	}
    
    testTranslationMap('encyclopedia_nav');
    testTranslationMap('encyclopedia_infobox_props');
 		testTranslationMapForDic('encyclopedia_items_section', ['encyclopedia_items_section']);
    testTranslationMap('encyclopedia_items_more');
    
    if (window.location.pathname.includes("/hobby/")) {
      testTranslationMap("item_prop");
      testTranslationMap('item_nav');
      testTranslationMapForDic('item_contribution_type', ['item_contribution_type']);
    } else if (window.location.pathname.includes("/user/home")) {
      testTranslationMap("home_action_type_filter");
      testTranslationMap("home_edit_action_type");
  		testTranslationMapForDic('home_username_info_type', ['home_username_info_type']);
      testTranslationMap('home_image_type_name');
      
      // TODO test for search placeholders
    }
  
  } catch (e) {
    console.error(e);
  }
  console.log('tests completed');
  });


console.log('script loading finished');           
  