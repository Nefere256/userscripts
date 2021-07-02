// ==UserScript==
// @name     Hpoi translate
// @version  0.1
// @include  https://www.hpoi.net/*
// @require  https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require  https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js
// @require  https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/locale/zh-cn.min.js
// @require  https://cdnjs.cloudflare.com/ajax/libs/expect/1.10.0/expect.min.js 
// @grant    none
// ==/UserScript==

/* TODO:
+ partial translate of links (not full texts)
* complex queries
** item rating refreshing after time (observe - rating_label doesnt work),
** get a translation from company names ?? (from entry pages - like 世嘉  => SEGA)
* find proper relative time parser (sugarjs is out - doesn't support Firefox)
* fixed tests for 'dic_first'

*/

/* places that doesn't work:
* home page
** user avatar list on top nav
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
* database search page
** basic filters line
** more filters side box
** release date pop up (BOXES EXIST WHEN NOT OPENED)

places that doesn't work AT ALL:
* user page
* use collection
* settings
* pics
* albums
* encyclopedia entries
* GK home page


low priority:
* home page
** shop ads at left column
** activity rankings at at left column
** comment pop-up
* item entry page
** selling new ad
** selling preowned info
** contributions detailed info
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
    'search_display_icon_size' : {
      '超小' : 'Very small',
      '小' : 'Small',
      '中' : 'Medium',
      '大' : 'Large',
      '超大': 'Very large',
    },
    'search_page_ibox' : {
    	'更多条件' : 'More filters',
    	'热门厂商' : 'Top manufacturers',
    	'发售时间表' : 'Release date',
  	},
    'search_item_props' : {
      '厂商' : 'Man',
      '出荷' : 'Rele.',
      '新增' : 'Add.',
    },
    
    
// types (filter)
		'全部' : 'all',
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
  'nav_top_left_menu' : '.hpoi-nav-tabbox > .nav-conters-left > li > a',
  'nav_top_left_submenu' : '.hpoi-nav-tabbox > .nav-conters-left > li > .hpoi-garagekit-box  > li > a',
  'nav_top_right_menu' : '.hpoi-nav-tabbox > .nav-conters-right > li > a',
  'nav_top_right_get_app' : 'html body nav.nav-conters div.hpoi-nav-tabbox ul.nav-conters-right li div.icon_Mobile_phone span',
  'nav_top_right_submenu' : '.hpoi-nav-tabbox > .nav-conters-right > li > .hpoi-garagekit-box  > li > a',
  'nav_top_search_drop_list' : '.nav-conters-right .dropdown-menu > li > a',
  'nav_top_search_drop_list_default' : '#searchItemTypeText',
  /* OTHER */
  'hpoi_box_title' : 'div.hpoi-box-title > .hpoi-title-left span',
  'profile_stats' : '.user-box-content > .row > div',
  'profile_desc' : '.user-box-content-detail > small',
  /* HOME PAGE */
  'home_action_type_filter' : 'div.user-home div.action-type ul.action-type-nav > li > a',
  'home_action_type_sub_filter' : 'div.user-home div.action-type ul.action-sub-nav > li > a',
  'home_edit_action_type' : '.home-info .home-info-content span.type-action',
  'home_username_info_type' : 'div.home-info > .row > .home-info-content div:not(.has-user) > .user-name',
  'home_image_type_name' : '.home-info .type-name',
  /* SEARCH PAGE*/
  'search_page_ibox' : '.ibox > .ibox-title > h5',
  'search_item_props' : 'ul.bs-glyphicons-list > li.detail-grid .detail-grid-info em',
  'search_filter_button_group' : 'div[aria-label="条件"] > div > button.btn-info',
  /* OTHER */
  'item_prop' : '.hpoi-ibox-content > .infoList-box > .hpoi-infoList-item > span',
  'item_nav' : '.navbar-header > ul.navbar-nav > li > a',
  'more_button' : '.hpoi-btn-border > span',
  'rating_label' : '.rating-bar-chart > .graphFieldrating_barchart > .graphLabelrating_barchart',
  'home-page-searchbox' : '.home-search-text',
  'search-searchbox' : '#realPage-keyword',
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
  

$(document).ready(function () {
	console.log('translations');
  
  doTranslation('nav_top_left_menu', ['x_item_types_plural', 'nav_top_right_menu']);
  doTranslation('nav_top_left_submenu');
  $('.hpoi-garagekit-box').css('width', '178px').css('margin-left', '-86px');
  doTranslation('nav_top_right_menu');
  doTranslation("nav_top_right_get_app");
  doTranslation("nav_top_right_submenu");
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
  doTranslation('rating_label');
	doTranslation('more_button');
	doTranslation('search_page_ibox');
	doTranslation('search_item_props');
  doTranslation('search_filter_button_group');
  
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

    testTranslationMap("nav_top_left_menu");
    testTranslationMap("nav_top_left_submenu");
    testTranslationMap("nav_top_right_menu");
    testTranslationMap("nav_top_right_get_app");
    testTranslationMap("nav_top_right_submenu");
    //testTranslationMap('nav_top_search_drop_list');
    //testTranslationMap('nav_top_search_drop_list_default');
    testTranslationMap('hpoi_box_title');
		testTranslationMap('search_page_ibox');
		testTranslationMap('search_item_props');
  	testTranslationMap('search_filter_button_group');
    
    if (window.location.pathname.includes("/hobby/")) {
      testTranslationMap("item_prop");
      testTranslationMap('item_nav');
    } else if (window.location.pathname.includes("/user/home")) {
      testTranslationMap("home_action_type_filter");
      testTranslationMap("home_edit_action_type");
  		//testTranslationMap('home_username_info_type');
      testTranslationMap('home_image_type_name');
      
      // TODO test for search placeholders
    }
  
  } catch (e) {
    console.error(e);
  }
  console.log('tests completed');
  });
                    
console.log('script loading finished');