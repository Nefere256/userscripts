// ==UserScript==
// @name     Hpoi fan translation
// @namespace https://takkkane.tumblr.com/scripts/hpoiTranslation
// @supportURL     https://twitter.com/TaxDelusion
// @description A script that translates text on Hpoi website to easily navigate
// @version  0.1.3
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

TODO:
* complex queries
** item rating refreshing after time (observe - rating_label doesnt work),
** get a translation from company names ?? (from entry pages - like 世嘉  => SEGA)

*/

/* places that doesn't work:
* home page
** 'star' window - owning pop up
* 'item' homepage
** database section tabs and entries info
** popular items on the right column
** latest info section tags and detailed info
* item entry page
** owning part
** rate part
** top nav action sublists
** related figures section (under main pic)
** re-releases (like https://www.hpoi.net/hobby/51360)
** wish for release? (yellow gift with heart, https://www.hpoi.net/hobby/51)
* database search page
** release date pop up (BOXES EXIST WHEN NOT OPENED)

places that doesn't work AT ALL:
* user page
* user collection
* settings!
* pics
* albums
* encyclopedia entries!
* GK home page


low priority:
* home page
** shop ads at left column
** activity rankings at at left column
** comment pop-up
* item entry page
** selling new ad
** selling preowned info
** report info on brief reviews
** magical table
** post comment section
* item tags
* /bannerItem/list
* articles
* /hobby/sell/amazon_jp

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
      '角色' : 'Role',
      '作品' : 'Series',
      '系列' : 'Subseries',
      '人物' : 'Person',
      '厂商' : 'Maker',
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
    'item_prop' : {
      '名称：' : 'Name:',
      '别名：' : 'Alias:',
      '属性：' : 'Attributes:',
      '定价：' : 'Price:',
      '发售日：' : 'Release date:',
      '发售：' : 'Release:',
      '比例：' : 'Scale:',
      '制作：' : 'Maker:',
      '发行：' : 'Publisher:',
      '系列：' : 'Line:',
      '原型：' : 'Sculptor:',
			'涂装：' : 'Coloring:',
			'原画：' : 'Designer:',
      '角色：' : 'Characters:',
      '作品：' : 'Origin:',
      '素材：' : 'Materials:',
      '材质：' : 'Materials:',
      '洗涤：' : 'Washing:',
      '尺寸：': 'Size:',
			'原型协力：' : 'Producer:',
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
  		'系列' : 'Subseries',
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
    },
    
    
// types (filter)
  	'x_generic_all' : {
      '全部' : 'all',
      '不限' : 'all' // actualy - non required
    },
		
    '其它' : 'other',
  
  /* SORTED DIC */
  'x_item_types' : {
      '手办' : 'Figure',
      '动漫模型' : 'Anime model',
      '真实模型' : 'Real model',
      '毛绒布偶' : 'Plushie',
      'Doll娃娃' : 'Doll',
    }, 
  'x_item_types_plural' : {
      '手办' : 'Figures',
      '动漫模型' : 'Anime models',
      '真实模型' : 'Real models',
      '毛绒布偶' : 'Plushies',
      'Doll娃娃' : 'Dolls',
    },
},
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
const doTranslation = function(itemInQuestion, subDictionaries = [], methodType = 'item_first') {
  if (subDictionaries.length) {
    methodType = 'dic_first';
  }
  
  let items = $(PLACES[itemInQuestion]);
  
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
	console.log('succes 2');
  
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
     doTranslation('item_contribution_type');
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
    doTranslation('search_filter_button_group_out_type', ['x_item_types', 'search_filter_button_group_out_type_list']);
    doTranslation('search_filter_button_group_out_type_list');
    doTranslation('search_filter_button_group_out_view', ['search_filter_button_group_out_view']);
    doTranslation('search_filter_button_display_icon_list');
    doTranslation('search_filter_more_filters_button', ['more_button']);
    doTranslation('search_filter_more_filters_button_list');
    doTranslation('search_filter_more_filters_list', ['search_filter_more_filters_button_list']);
  }
  
  
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
      testTranslationMapForDic('search_filter_button_group_out_type',  ['x_item_types', 'search_filter_button_group_out_type_list']);
      testTranslationMap('search_filter_button_group_out_type_list');
      testTranslationMapForDic('search_filter_button_group_out_view', ['search_filter_button_group_out_view']);
      testTranslationMap('search_filter_button_display_icon_list');
    	testTranslationMapForDic('search_filter_more_filters_button', ['more_button']);
      testTranslationMap('search_filter_more_filters_button_list');
    	testTranslationMapForDic('search_filter_more_filters_list', ['search_filter_more_filters_button_list']);
    }
    
    if (window.location.pathname.includes("/hobby/")) {
      testTranslationMap("item_prop");
      testTranslationMap('item_nav');
      testTranslationMapForDic('item_contribution_type', ['item_contribution_type']);
    } else if (window.location.pathname.includes("/user/home")) {
      testTranslationMap("home_action_type_filter");
      testTranslationMap("home_edit_action_type");
  		testTranslationMap('home_username_info_type');
      testTranslationMap('home_image_type_name');
      
      // TODO test for search placeholders
    }
  
  } catch (e) {
    console.error(e);
  }
  console.log('tests completed');
  });


console.log('script loading finished');           
  