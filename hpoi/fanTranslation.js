// ==UserScript==
// @name     Hpoi fan translation
// @namespace https://takkkane.tumblr.com/scripts/hpoiTranslation
// @supportURL     https://twitter.com/TaxDelusion
// @description A script that translates common text on Hpoi - anime figures database
// @version  0.3.3
// @downloadURL	https://raw.githubusercontent.com/Nefere256/userscripts/master/hpoi/fanTranslation.js
// @include  https://www.hpoi.net/*
// @require  https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require  https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js
// @require  https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/locale/zh-cn.min.js
// @require  https://cdnjs.cloudflare.com/ajax/libs/expect/1.10.0/expect.min.js 
// @grant    none
// ==/UserScript==

(function() {
/* 
Expect library by mjackson https://github.com/mjackson/expect
*/

/* worthy examples:
* working with hpoi: https://github.com/ntzyz/hpoi-info-tgbot/blob/master/src/entry.ts
* tricky html items: https://greasyfork.org/en/scripts/384708-bilibili-danmaku-translator/code
*/

	/* ==== RESOURCES ===== */

const TRANSLATIONS = {
  // 'dictionary' : {
  // 'word' : 'translation', }
  en: {
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
      '制作' : 'New items',
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
       '预定时间' : 'Preorders opened', 
       '出荷延期' : 'Release postponed',
       '出荷时间' : 'Release time',
       '再版确定' : 'Re-release confirmed',
      '情报更新' : 'Info updated',
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
      '厂商' : 'Manufacturer',
  		'系列' : 'Line',
			'作品' : 'Series',
      '角色' : 'Character',
    },
    /* ITEM HOME PAGE */
    'home_item_database_tabs' : {
      '最新入库' : 'Recently added',
      '热门预定' : 'Most ordered',
      '热门出荷' : 'Close release',
    },
    'home_item_popular_tabs' : {
      '每日热门' : 'Best today',
      '每周热门' : 'Best this week',
      '好评top' : 'Best',
    },
    'home_item_popular_hits' : {
      '浏览' : 'Hits',
    },
    'home_item_amazon_buy' : {
      '捡!' : 'Buy!',
    },
    
    /* ITEM PAGE */
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
			'版权标记：' : 'Copyrights:',
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
    
    /*  SETTINGS */ 
    'settings_list' : {
      '基本资料' : 'General info',
      '屏蔽设置' : 'Block settings',
      '隐私设置' :  'Privacy settings',
		'推送设置' : 'Notification settings',
      '修改密码' : 'Change password',
      '更换邮箱' : 'Change e-mail',
      '更换手机号' : 'Change phone number',
      '账号关联' : 'Account linking',
      '头像' : 'Avatar',
      '用户设置' : 'User settings',
		'注销' : 'Delete account',
    },
    'settings_panel_button' : {
      '保存' : 'Save',
      '更换' : 'Change',
      '获取' : 'Obtain',
    },
    'settings_general_form' : {
      '昵称:' : 'Nickname:',
      '签名:' : 'Signature:',
      '性别:' : 'Gender:',
      '生日:' : 'Birthday:',
      '自我介绍:' : 'About:',
    },
    'settings_general_form_gender' : {
      '男' : 'Male',
      '女' : 'Female',
      '保密' : 'Secret',
    },
    'settings_block_form' : {
      'NSFW内容:' : 'NSFW content:', 
      '屏蔽动态显示:' : 'Dynamic list content:',
      '邮件通知:' : 'Email notifications:',
      '短信通知:' : 'SMS notifications:',
      '条目评论区:' : 'Entry page comment section',
    },
    'settings_block_form_radio' : {
      '提示我' : 'Prompt me',
      '不显示' : 'Don\'t show',
      '显示' : 'Show',
      '情报': 'Info',
      '评论' : 'Comment',
      '图片上传' : 'New pics',
      '出售' : 'Sale', 
      '求购' : 'Hunt',
      '商品开订' : 'Preorders opened',
      '商品截单' : 'Preorders ended',
      '商品出荷' : 'Items released',
      '直接显示' : 'Show directly',
      '手动展开' : 'Show when requested',
    },
    'settings_privacy_headers' : {
    '周边条目' : 'Collection',
    '收藏内容' : 'Favorites',
    '收藏统计' : 'Collection stats',
    '其他内容' : 'Other',
    },
    'settings_privacy_form' : {
      "手办、动漫模型、真实模型、毛绒布偶、Doll娃娃" : 'figures, dolls, plushies etc',
      '相册、图片、文章' : 'albums, pics, articles',
      '历史消费、入手数量、待补款等' : 'activity, items quantity, ordered etc.',
      '系列、厂商、角色、人物、作品' : 'lines, companies, characters, people, series',
    },
    'settings_privacy_form_radio' : {
      '所有人可见' : 'For all',
      '互相关注可见' : 'For friends',
      '仅自己可见' : 'For me',
    },
    'settings_password_form' : {
      '旧密码:' : 'Old password:',
      '新密码:' : 'New password:',
      '确认密码:' : 'Confirm new password:',
    },
    'settings_email_link_avatar_form' : {
      '邮箱' : 'Email',
      '旺旺ID:' : 'WangWang ID:',
      '原图' : 'Original image',
      '缩略图' : 'Thumbnail',
      '使用新图' : 'Use new image',
    },
    'settings_phone_form' : {
      '原手机号:' : 'Old phone number:',
      '密码:' : 'Password:',
      '新手机号:' : 'New phone number',
      '获取验证码:' : 'Verification code:',
    },
    'settings_phone_form_placeholder' : {
      '图片验证' : 'A picture text',
      '填写短信验证码' : 'Fill in a code from SMS',
    },
    'settings_avatar_form_placeholder' : {
      '在线上传请在此输入地址' : 'Paste image URL',
			'如需本地上传，请选择文件' : 'Select image file',
    },
    'settings_avatar_form_button_upload' : {
      '在线上传' : 'Upload',
			'本地上传' : 'Upload',
    },
    'settings_avatar_form_button_cancel' : {
    	'还是算了' : 'Cancel',
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
      '其它' : 'Other',
    }, 
    'x_item_types_plural' : {
      '手办' : 'Figures',
      '动漫模型' : 'Anime models',
      '真实模型' : 'Real models',
      '毛绒布偶' : 'Plushies',
      'Doll娃娃' : 'Dolls',
		'GK/DIY模型' : 'Garage kits/models'
    },
    'x_subtypes_figures' : {
			'比例人形' : 'Scale figure',
      'Q版人形' : 'Chibi figure',
      '盒蛋/扭蛋' : 'Blind box/gacha',
      '怪兽/机械' : 'Monster/mecha',
      '仿真人物' : 'Real person',
      '配件' : 'Accessory',
      '场景' : 'Diorama',
    	'其它' : 'Other',
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
      '其它' : 'Other',
    },
    'x_subtypes_real_models' : {
      '拼装' : 'To assembly',
      '完成品' : 'Completed',
      '人形' : 'Person',
      '场景配件' : 'Diorama accessory',
      '工具材料' : 'Tool',
    },
    'x_subtypes_plushies' : {
      '拟人形' : 'Anthropomorphic',
      '人形' : 'Human',
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
  /* HOME ITEM PAGE */
  'home_item_props' : 'div.hpoi-database-content > div > div.hpoi-dataBase-item > div > div.hpoi-database-text > div > span:nth-of-type(1)',
  'home_item_database_tabs' : '#database-newAdd, #database-hotOrder, #database-release',
  'home_item_popular_tabs' : 'div.hpoi-databas-popular > div > div > div.database-select > a',
  'home_item_popular_hits' : 'div.hpoi-populartext-box',
  'home_item_amazon_buy' : 'div.hpoi-nichiapick > div.hpoi-nichiapick-box > div > div.hpoi-nichiapick-item > div.hpoi-nichiapick-content > div.hpoi-nichiapick-text > a.hpoi-nichia-pick',
  'home_item_info_sub_filter' : 'div.hpoi-latestinformation-left > div.hpoi-box-title > div.hpoi-title-left > a',
  'home_item_info_action_type' : 'div.hpoi-latestinformation-left > div.hpoi-conter-ltsifrato > div.hpoi-conter-left > div.right-leioan > div:nth-of-type(2) > span',
  'home_item_info_type_long' : 'div.hpoi-latestinformation-left > div.hpoi-conter-ltsifrato > div.hpoi-conter-left > div.right-leioan > div:nth-of-type(1) > span:nth-of-type(1)',
  'home_item_info_time' : 'div.hpoi-latestinformation-left > div.hpoi-conter-ltsifrato > div.hpoi-conter-left > div.right-leioan > div:nth-of-type(1) > span:nth-of-type(2)',
  'home_item_info_type_name' : 'div.hpoi-latestinformation-left > div.hpoi-conter-ltsifrato > div.hpoi-conter-left > div.left-leioan > span',
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
  'search_global_ibox_description' : '.ibox:first > .ibox-content *',
  /* SETTINGS */ 
  'settings_list' : '.list-group > .list-group-item',
  'settings_panel_title' : '.panel > .panel-heading',
  'settings_panel_button' : '.form-group > div > button',
  'settings_general_form' : '#editData > .form-group > label',
  'settings_general_form_gender' : '#editData > .form-group > div > label.radio-inline',
  'settings_block_form' : '#updSetting > .form-group > label',
  'settings_block_form_radio' : '#updSetting > .form-group > div > label.radio-inline',
  'settings_privacy_headers' : '#updSetting > .form-group > div.row > h4',
  'settings_privacy_form' : '#updSetting > .form-group > div.row > span',
  'settings_privacy_form_radio' : '#updSetting > .form-group > div > div.privacySetting-option  > label.radio-inline',
  'settings_password_form' : 'form#updPwd > div.form-group > label',
  'settings_email_link_avatar_form' : 'form.form-horizontal > div.panel > div.panel-body > div.form-group > label',
  'settings_phone_form' : 'form#updPhone > div.form-group > label',
  'settings_phone_form_placeholder' : 'form#updPhone > div.form-group > div > input[placeholder]',
  'settings_avatar_form_placeholder' : '.form-group > div > div.input-group > input[placeholder]',
  'settings_avatar_form_button_upload' : '.form-group > div > div.input-group > span.input-group-btn > button',
  'settings_avatar_form_button_cancel' : '.form-group > div.bs-example > a.btn',
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
* methodType 
		- 'item_first' - replace the exact string appearing in itemInQuestion results
		- 'dic_first' - check all keys listed in subDictionaries and replace them with translations stored in values
* elementsInQuestion - optional if you'd like to use
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
	let date, dateEn;
	if (dateCn.indexOf('日') != -1) {
		date = moment(dateCn, "YYYY年MM月DD日");
		dateEn = date.format("DD/MM/YYYY");
	} else if (dateCn.indexOf('月') != -1) {
		date = moment(dateCn, "YYYY年MM月");
		dateEn = date.format("MM/YYYY");
	} else if (dateCn.indexOf('年') != -1) {
		date = moment(dateCn, "YYYY年");
		dateEn = date.format("YYYY");
	}
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
	if (translatedText.length == 0) {return; /*continue*/}
    for(const subDictionary of dictionaries) {
		let subDictionaryEntries = [];
		if ($.type(subDictionary) === "string") {
			subDictionaryEntries = Object.entries(TRANSLATIONS.en[subDictionary]);
		} else {
			subDictionaryEntries = subDictionary;
		}

      for(const subDictionaryEntry of subDictionaryEntries) { /*[0] key [1] value*/
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

/* SECTIONS */

const section = {
  translations : {},
  places : {},
  
  doTranslation(itemInQuestion, subDictionaries = [], elementsInQuestion) {
    const me = this;
    let items;
    if(!elementsInQuestion)
      items = $(this.places[itemInQuestion]);
    else
      items = elementsInQuestion;

    let textItems = items.contents().filter(function() {
      return this.nodeType === Node.TEXT_NODE;
    });

    textItems.each(function(i,e) {
      if (!subDictionaries.length) {
		 e.textContent = e.textContent.trim();
        const bad = e.textContent;
        let translation = me.translations.en[itemInQuestion][bad];
        if (translation) {
          e.textContent = translation;
        } 
      } else {
        let translationDone = 0;
        e.textContent = e.textContent.trim();
        let toTranslate = e.textContent;
        for(const subDictionaryName of subDictionaries) {
          let subDictionary;
          if (typeof(subDictionaryName) === 'string') {
            subDictionary = me.translations.en[subDictionaryName];
          } else {
            subDictionary = subDictionaryName;
          }
          
          for(const subDictionaryEntry of Object.entries(subDictionary)) { /*[0] key [1] value*/
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
  },
  
  testTranslationMap(submapToCheck) {
    const me = this;
    expect(me.places[submapToCheck]).toExist("jquery for [" + submapToCheck + "] should exists.");
    expect($(me.places[submapToCheck])).toExist("items found via jquery for [" + submapToCheck + "] should exist.");
    $(me.places[submapToCheck]).each(function(i,e) {
      expect(Object.values(me.translations.en[submapToCheck]).find(translation => translation.includes(e.textContent.trim())))
        .toBeTruthy("No translation provided for [" + e.textContent + "] in [" + submapToCheck + "] map!");
    });
  },
  
  testTranslationMapForDic(placeToCheck, dictionaries) {
    const me = this;
    expect(me.places[placeToCheck]).toExist("jquery for [" + placeToCheck + "] should exists.");
    expect($(me.places[placeToCheck])).toExist("items found via jquery for [" + placeToCheck + "] should exist.");

    $(me.places[placeToCheck]).each(function(i,e) {
      let translationIsDone = 0;
      let translatedText = e.textContent.trim();
		if (translatedText.length == 0) {return; /*continue*/}
      for(const subDictionaryName of dictionaries) {
          let subDictionary;
          if (typeof(subDictionaryName) === 'string') {
            subDictionary = me.translations.en[subDictionaryName];
          } else {
            subDictionary = subDictionaryName;
          }
        for(const subDictionaryEntry of Object.entries(subDictionary)) { /*[0] key [1] value*/
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
  },
  
};

/* new type tile for items */
let glyph_tile_section = Object.create(section); 
glyph_tile_section.translations = {
	en: {
		'tile_properties' : {
			'厂商：' : 'Man.: ', // manufacturer
			'出荷：' : 'Released: ', // Release date
			'新增：' : 'Addded: ', // Addition date
			'价格：' : 'Price: ', // Price
			'愿望：' : 'Wish: ', // Wished by x people
			'浏览：' : 'Hits: ', // how many views
			'评分：' : 'Rate: ', // overal rate
			//collection only
			'途径：' : 'Way: ', // channel? shop? shipment?
			'补款：' : 'Due: ', // how many money yet to paid
			// line only
			'名称：' : 'Name: ',
			'作品：' : 'Count: ',
			'更新：' : 'Updated: ',
		},
	},
};
glyph_tile_section.places = {
  'tile_properties' : 'ul.hpoi-glyphicons-list > li > .hpoi-detail-grid-right > .hpoi-detail-grid-info > span > em',
};
glyph_tile_section.translate = function() {
    this.doTranslation('tile_properties');
	// translate release dates
	let cnDateTextElementsToTranslate = [this.translations.en['tile_properties']['出荷：'],
			this.translations.en['tile_properties']['新增：'], this.translations.en['tile_properties']['更新：']];
	let cnDateRows = $('.hpoi-detail-grid-info > span');
	let cnDateTextElements = cnDateRows.contents().filter(function() {
		if (this.nodeType === Node.TEXT_NODE) {
			let previousSiblingText = this.previousElementSibling.innerHTML;
			if (cnDateTextElementsToTranslate.includes(previousSiblingText)) {return true;}
		}
	});
	translateFixedDate(cnDateTextElements);

};
glyph_tile_section.testTranslation = function () {
	this.testTranslationMap('tile_properties');
};

let nav_top_section = Object.create(section);

  nav_top_section.translations = {
    en : {
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
		'小黑屋' : 'Reports',
        '商城' : 'Mall',
		'消息' : 'Messages',
        '登录' : 'Login',
      },
      'nav_top_right_get_app' : {
        '下载客户端' : 'Apps',
      },
		'nav_top_get_app_submenu' : {
			'点击下载APP' : 'Download the app',
			'扫码关注公众号' : 'Scan to follow WeChat account',
			'扫码加入Q群:884038717' : 'Scan to join WeChat group',
	},
      'nav_top_right_submenu' : {
        '厂商首页' : 'Home',
        '我的收藏' : 'My collection',
        '上报缺失' : 'Report missing info',
        '商品上新' : 'Recent sales',
        '二手专区' : 'Preowned',
        '淘宝自营店' : 'Taobao own shop',
        '淘宝天狗店' : 'Taobao Tengu shop',
		'淘宝周边店' : 'Taobao other shop',
		'淘宝一番赏' : 'Taobao rewards'
      },
      'nav_top_personal' : {
        '个人中心' : 'Profile',
        '我的收藏' : 'My collection',
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
    },
  };
  
  nav_top_section.places = {
    'nav_top_left_menu'	: '.hpoi-nav-tabbox > .nav-conters-left > li > a',
    'nav_top_left_submenu'	: '.hpoi-nav-tabbox > .nav-conters-left > li > .hpoi-garagekit-box  > li > a',
    'nav_top_right_menu'	: '.hpoi-nav-tabbox > .nav-conters-right > li > a:not(.icon-Mobile-phone)',
    'nav_top_right_get_app'	: 'nav.nav-conters > div.hpoi-nav-tabbox > ul.nav-conters-right > li > .icon-Mobile-phone span',
	'nav_top_right_get_app_submenu'	: 'nav.nav-conters > div.hpoi-nav-tabbox > ul.nav-conters-right > li > ul.hpoi-Downloadclient > li > a > div',
    'nav_top_right_submenu'	: '.hpoi-nav-tabbox > .nav-conters-right > li > .hpoi-garagekit-box > li > a',
    'nav_top_personal'	: 'ul.hpoi-navpersonal > li > a',
    'nav_top_search_drop_list'	: '.nav-conters-right .dropdown-menu > li > a',
    'nav_top_search_drop_list_default'	: '#searchItemTypeText',
	'nav_top_narrow_screen_menu' : '.nav-conters-s > .hpoi-nav-boxs > .nav-boxs-item > a:not(.hpoi-icon-phonebox)',
	'nav_top_narrow_screen_get_app' : '.nav-conters-s > .hpoi-nav-boxs > .nav-boxs-item > a.hpoi-icon-phonebox > span','nav_top_narrow_screen_get_app_submenu' : '.nav-conters-s > .hpoi-nav-boxs > .nav-boxs-item > a.hpoi-icon-phonebox + ul > li > a > div',
	'nav_top_narrow_screen_submenu' : '.nav-conters-s > .hpoi-nav-boxs > .nav-boxs-item > a:not(.hpoi-icon-phonebox) + ul > li > a',
  };
  
nav_top_section.translate = function() {
    this.doTranslation('nav_top_left_menu', [TRANSLATIONS.en['x_item_types_plural'], 'nav_top_left_menu']);
    this.doTranslation('nav_top_left_submenu');
    $('.hpoi-garagekit-box').css('width', '178px');
    this.doTranslation('nav_top_right_menu');
    this.doTranslation('nav_top_right_get_app');
    this.doTranslation('nav_top_right_get_app_submenu', ['nav_top_get_app_submenu']);
    this.doTranslation("nav_top_right_submenu");
    this.doTranslation("nav_top_personal");
    this.doTranslation('nav_top_search_drop_list', ['nav_top_search_drop_list', TRANSLATIONS.en['x_item_types']]);
    this.doTranslation('nav_top_search_drop_list_default');
	this.doTranslation('nav_top_narrow_screen_menu', [TRANSLATIONS.en['x_item_types_plural'], 'nav_top_left_menu', 'nav_top_right_menu']);
	this.doTranslation('nav_top_narrow_screen_get_app', ['nav_top_right_get_app']);
    this.doTranslation('nav_top_narrow_screen_get_app_submenu', ['nav_top_get_app_submenu']);
	this.doTranslation('nav_top_narrow_screen_submenu', ['nav_top_personal', 'nav_top_left_submenu', 'nav_top_right_submenu']);
  };

nav_top_section.testTranslation = function () {
  this.testTranslationMapForDic("nav_top_left_menu", [TRANSLATIONS.en['x_item_types_plural'], 'nav_top_left_menu']);
  this.testTranslationMap("nav_top_left_submenu");
  this.testTranslationMap("nav_top_right_menu");
  this.testTranslationMap("nav_top_right_get_app");
    this.testTranslationMapForDic('nav_top_right_get_app_submenu', ['nav_top_get_app_submenu']);
  this.testTranslationMap("nav_top_right_submenu");
  this.testTranslationMap("nav_top_personal");
  this.testTranslationMapForDic('nav_top_search_drop_list', ['nav_top_search_drop_list', TRANSLATIONS.en['x_item_types']]);
  this.testTranslationMap('nav_top_search_drop_list_default');
	this.testTranslationMapForDic('nav_top_narrow_screen_menu', [TRANSLATIONS.en['x_item_types_plural'], 'nav_top_left_menu', 'nav_top_right_menu']);
	this.testTranslationMapForDic('nav_top_narrow_screen_get_app', ['nav_top_right_get_app']);
    this.testTranslationMapForDic('nav_top_narrow_screen_get_app_submenu', ['nav_top_get_app_submenu']);
	this.testTranslationMapForDic('nav_top_narrow_screen_submenu', ['nav_top_personal', 'nav_top_left_submenu', 'nav_top_right_submenu']);
};

let encyclopedia_section = Object.create(section);
encyclopedia_section.translations = {
	en : {
		'encyclopedia_nav' : {
			'推送动态' : 'Push action',
			'编辑' : 'Edit',
		},
		'encyclopedia_nav_submenu' : {
			'基本资料' : 'Edit info',
			'封面' : 'Edit cover'
		},
		'encyclopedia_header_type' : {
			'角色' : 'Character',
			'作品' : 'Series',
			'系列' : 'Line',
			'人物' : 'Person',
			'厂商' : 'Company',
		},
		'encyclopedia_infobox_props' : {
			'名称：' : 'Name: ',
			'中文名：' : 'Chinese name: ',
			'别名：' : 'Aliases: ',
			'地区：' : 'Country: ',
			'官网：' : 'Website: ',
			'官方网站：' : 'Official website: ',
			'官方微博：' : 'Official Weibo: ',
			'推特：' : 'Twitter: ',
			'微博：' : 'Weibo: ',

			'成立时间：' : 'Founded date: ',
			'成立日期：' : 'Founded date: ',
			'所在地：' : 'Location: ',
      
			'性别：' : 'Sex: ',
			'生日：' : 'Birthday date: ',
			'星座：' : 'Zodiac: ',
			'家庭情况：' : 'Family info: ',
			'前任监护人：' : 'Former guardian: ',
			'监护人：' : 'Guardian: ',
			'血型：' : 'Blood type: ',
			'引用来源：' : 'Info source: ',
			'Anidb ID：' : 'Anidb ID: ',
			'母亲：' : 'Mother: ',
			'学籍：' : 'Student status: ',
			'种族：' : 'Race: ',
			'身高：' : 'Height: ',
			'年龄：' : 'Age: ',
			'体重：' : 'Weight: ',
			'三围：' : 'Body meas.: ',
			'出生地：' : 'Place of birth: ',
			'国籍：' : 'Nationality: ',
			'声优：' : 'Voice actor: ',
			'音源：' : 'Voice provider: ',
			'稀有度：' : 'Rarity: ',
			'编号：' : 'Number: ',
			'阵营：' : 'Faction: ',
      
			'类型：' : 'Type: ',
			'时间：' : 'Time: ',
			'话数：' : 'Episodes: ',
			'放送星期：' : 'Week day of stream.: ',
			'发行日期：' : 'Released: ',
			'开发：' : 'Developed: ',
		},
		'encyclopedia_series_types' : {
			'动画' : 'Video',
			'游戏' : 'Game',
			'其它' : 'Other',
		},
		'encyclopedia_items_section' : {
			'详情': 'Info', 
			'自营周边' : 'Sold by Hpoi',
			'相关商品' : 'Related products',
			'最新作品' : 'Latest items',
			'关联手办' : 'Related figures', 
			'相关手办' : 'Related figures',
			'系列' : 'Lines', 
			'制作周边' : 'Items manufactured',
			'发行周边' : 'Items distributed', 
			'关联周边' : 'Related items', 
			'相关周边' : 'Related items',
			'她参与的手办' : 'Figures worked on',
			'他参与的手办' : 'Figures worked on',
			'评论' : 'Comments'
		},
		'encyclopedia_items_more' : {
			'全部' : 'more',
		},
	},
};
encyclopedia_section.places = {
	/* ENCYCLOPEDIA */
	'encyclopedia_nav' : '.hpoi-company-dropdown a',
	'encyclopedia_nav_submenu' : '.hpoi-company-dropdown > .company-edit > ul > li > a',
	'encyclopedia_header_type' : '.hpoi-company-info .info-head > span:nth-of-type(1)',
	'encyclopedia_infobox_props' : '.company-ibox > div.row > div.item-details',
	'encyclopedia_items_more' : '.company-ibox > .item-head a.hpoi-btn-more > span',
	'encyclopedia_items_header_list' : '.hpoi-company-nav > div > a.nav-item',
	'encyclopedia_items_header' : '.company-ibox > .item-head > div > h3',
	'encyclopedia_items_header_count' : '.company-ibox > .item-head > div > span',
};
encyclopedia_section.isToTranslate = function () {
	const PATHNAME = window.location.pathname;
	if (PATHNAME.includes('/company/') || PATHNAME.includes('/series/') 
		|| PATHNAME.includes('/works') || PATHNAME.includes('/charactar/') 
		|| PATHNAME.includes('/person/')) {
		return true;
	}
	return false;
};

  /* do stuff to translate text like
	共8个相关商品	=> Total 8 related products
	共153条	=> Total 153 (lines, comments)
	共3723个	=> Total 153 (items)
	共91个相关周边	=> Total 91 related items
	共29个相关手办	=> Total 29 related figures

	1st part > up to counter like  个, 条
	2nd part > after counter, translate according to dictionary
  */
encyclopedia_section.translateEncyclopediaItemsHeader = function(element, dicDef) {
    let textToTranslate = element.textContent.trim();
    let translation = "";
	// let counterSymbol = ['个', '条'];
	let partsSplittedByCounters = textToTranslate.split(/[个条]+/);

	let numberPart = partsSplittedByCounters[0];
	let number = numberPart.substring(1);
	translation += "Total ";
	translation += number;

	let secondPartTranslation = "";
	let secondPartExists = partsSplittedByCounters.length == 2;
	if (secondPartExists && partsSplittedByCounters[1].length > 0) {
		secondPartTranslation = (dicDef[partsSplittedByCounters[1]]).toLowerCase();

		translation += " ";
		translation += secondPartTranslation;
	}
    element.textContent = translation;
  };

encyclopedia_section.translate = function() {
	const me = this;
	if (me.isToTranslate()) {
		me.doTranslation('encyclopedia_nav');
		me.doTranslation('encyclopedia_nav_submenu');
		me.doTranslation('encyclopedia_header_type');
		me.doTranslation('encyclopedia_items_header_list', ['encyclopedia_items_section']);
		$(me.places['encyclopedia_items_header_list']).css('margin-left', '20px');
		me.doTranslation('encyclopedia_items_header', ['encyclopedia_items_section']);
		me.doTranslation('encyclopedia_infobox_props', ['encyclopedia_infobox_props']);
		me.doTranslation('encyclopedia_items_more');

		$(me.places['encyclopedia_items_header_count']).each(function(index, element) {
			me.translateEncyclopediaItemsHeader(element, me.translations['en']['encyclopedia_items_section']);
		});
		glyph_tile_section.translate();
	}

};
encyclopedia_section.testTranslation = function () {
	if ( this.isToTranslate()) {
		this.testTranslationMap('encyclopedia_nav');
		this.testTranslationMap('encyclopedia_nav_submenu');
		this.testTranslationMap('encyclopedia_header_type');
		this.testTranslationMapForDic('encyclopedia_items_header_list', ['encyclopedia_items_section']);
		this.testTranslationMapForDic('encyclopedia_items_header', ['encyclopedia_items_section']);
		this.testTranslationMapForDic('encyclopedia_infobox_props', ['encyclopedia_infobox_props']);
		this.testTranslationMap('encyclopedia_items_more');
		glyph_tile_section.testTranslation();
	}
};

$(document).ready(function () {
	console.log('translating starting...');
  const PATHNAME = window.location.pathname;
  
  nav_top_section.translate();
  //3 pages in one
  doTranslation('hpoi_box_title', ['hpoi_box_title', 'x_item_types_plural']);
  
  if (PATHNAME.includes('/user/home') || PATHNAME.includes('/index') || PATHNAME == '/') {
    doTranslation('profile_stats');
    doTranslation('profile_desc');
    doTranslation('home_action_type_filter');
    doTranslation('home_action_type_sub_filter');
    doTranslation('home_edit_action_type');
    $(PLACES['home_edit_action_type']).prev().css('width', '60%');
    doTranslation('home_username_info_type');
    doTranslation('home_image_type_name');
    
    let relativeTimes = $('span.type-time');
  	translateRelativeDate(relativeTimes);
  }
  if (PATHNAME === '/'  || PATHNAME.endsWith('/index') || PATHNAME.endsWith('/user/home') || PATHNAME.endsWith('/hobby/') 
	|| PATHNAME.endsWith('/hobby/model') || PATHNAME.endsWith('/hobby/real')
	|| PATHNAME.endsWith('/hobby/moppet') || PATHNAME.endsWith('/hobby/doll')) { 
    doTranslation(null, ['search_item_props'], 'dic_first', $(PLACES['home_item_props']));
    doTranslation('home_item_database_tabs');
    doTranslation('home_item_popular_tabs');
    doTranslation('home_item_popular_hits', ['home_item_popular_hits']);
    doTranslation('home_item_amazon_buy');
    doTranslation('home_item_info_sub_filter', ['home_action_type_sub_filter']);
    doTranslation('home_item_info_action_type', ['home_edit_action_type']);
    doTranslation('home_item_info_type_long', ['home_username_info_type']);
    let relativeTimes = $(PLACES['home_item_info_time']);
  	translateRelativeDate(relativeTimes);
    
    
    if (PATHNAME.endsWith('/hobby/')) {
      doTranslation('home_item_info_type_name', ['x_subtypes_figures']);
    } else if (PATHNAME.endsWith('/hobby/model')) {
      doTranslation('home_item_info_type_name', ['x_subtypes_anime_models']);
    } else if (PATHNAME.endsWith('/hobby/real')) {
      doTranslation('home_item_info_type_name', ['x_subtypes_real_models']);
    } else if (PATHNAME.endsWith('/hobby/moppet')) {
      doTranslation('home_item_info_type_name', ['x_subtypes_plushies']);
    } else if (PATHNAME.endsWith('/hobby/doll')) {
      doTranslation('home_item_info_type_name', ['x_subtypes_dolls']);
    } else if (PATHNAME === '/' || PATHNAME.endsWith('/index') || PATHNAME.endsWith('/user/home')) {
		doTranslation('home_item_info_type_name', ['home_image_type_name']);
	}
    
  }
  if(PATHNAME.includes("/hobby/")) {
    doTranslation('item_prop');
    doTranslation('item_nav');
    doTranslation('item_contribution_type', ['item_contribution_type']);
    
  }
  doTranslation('rating_label');
	doTranslation('more_button');
	doTranslation('search_item_props');
  if (PATHNAME.includes('/hobby/all')) { // item search page
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
    doTranslation('search_filter_button_group_out_view', ['search_filter_button_group_out_view']);
    doTranslation('search_filter_button_display_icon_list');
    doTranslation('search_filter_more_filters_button', ['more_button']);
    doTranslation('search_filter_more_filters_button_list');
    doTranslation('search_filter_more_filters_list', ['search_filter_more_filters_button_list']);
    doTranslation('search_modal_window_header');
    doTranslation('search_modal_window_body');
    doTranslation('search_modal_window_footer');

    const typeToTypeDic = function (categoryId) {
      if (categoryId <= 100)
        return 'x_subtypes_figures';
      if (categoryId <= 200)
        return 'x_subtypes_anime_models';
      if (categoryId <= 300)
        return 'x_subtypes_dolls';
      if (categoryId <= 400)
        return 'x_subtypes_plushies';
      if (categoryId <= 500)
        return 'x_subtypes_real_models';
      if (categoryId <= 900)
        return 'x_subtypes_merch';
    };
    
    let category = new URL(window.location).searchParams.get("category");
    if (category == null || category == 0) {
      doTranslation('search_filter_button_group_out_type', ['x_item_types', 'x_generic_all']);
      doTranslation('search_filter_button_group_out_type_list', ['x_item_types', 'x_generic_all']);
    } else if (category % 100 == 0) { // main type
      doTranslation('search_filter_button_group_out_type', ['x_item_types']);
      doTranslation('search_filter_button_group_out_type_list', [typeToTypeDic(category), 'x_generic_all']);
    } else if (category % 100 != 0) { // sub type
      doTranslation('search_filter_button_group_out_type', [typeToTypeDic(category)]);
      doTranslation('search_filter_button_group_out_type_list', [typeToTypeDic(category), 'x_generic_all']);
    }
    
  }
  if (PATHNAME.includes('/search')) {
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
  
	encyclopedia_section.translate();

  if (PATHNAME.includes('/user/edit/')) {
      doTranslation('settings_list');
      doTranslation('settings_panel_title', ['settings_list']);
    	doTranslation('settings_panel_button');
   		doTranslation('settings_general_form');
    	doTranslation('settings_general_form_gender');
    	doTranslation('settings_block_form');
    	doTranslation('settings_block_form_radio');
      doTranslation('settings_privacy_headers');
      doTranslation('settings_privacy_form', ['settings_privacy_form']);
      doTranslation('settings_privacy_form_radio');
    	doTranslation('settings_password_form');
    	doTranslation('settings_email_link_avatar_form');
    	doTranslation('settings_phone_form');
    	doTranslation('settings_avatar_form_button_upload');
   		doTranslation('settings_avatar_form_button_cancel');
    
      var verifyboxes = $(PLACES['settings_phone_form_placeholder']);
      for(const verifybox of verifyboxes) {
        verifybox.attributes['placeholder'].textContent = 
          TRANSLATIONS.en['settings_phone_form_placeholder'][verifybox.attributes['placeholder'].textContent];
      }
    	var uploadBoxes = $(PLACES['settings_avatar_form_placeholder']);
      for(const uploadBox of uploadBoxes) {
        uploadBox.attributes['placeholder'].textContent = 
          TRANSLATIONS.en['settings_avatar_form_placeholder'][uploadBox.attributes['placeholder'].textContent];
      }
  }
  
  
  let datesCnReleaseDate = $('.hpoi-ibox-content > .infoList-box > .hpoi-infoList-item > span:contains("date")').siblings('p').children('a');
  let datesTextesReleaseDate = datesCnReleaseDate.contents().filter(function() {
    return this.nodeType === Node.TEXT_NODE;
  });
  translateFixedDate(datesTextesReleaseDate);
  
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

	nav_top_section.testTranslation();

    testTranslationMapForDic('hpoi_box_title', ['hpoi_box_title', 'x_item_types_plural']);
		testTranslationMap('search_item_props');
    if (PATHNAME.endsWith('/hobby/') || PATHNAME.endsWith('/hobby/model') ||
    PATHNAME.endsWith('/hobby/real') || PATHNAME.endsWith('/hobby/moppet') ||
     PATHNAME.endsWith('/hobby/doll') || PATHNAME === '/' || PATHNAME.endsWith('/index') || PATHNAME.endsWith('/user/home')) {
      testTranslationMap('home_item_database_tabs');
      testTranslationMap('home_item_popular_tabs');
      testTranslationMapForDic('home_item_popular_hits', ['home_item_popular_hits']);
      testTranslationMap('home_item_amazon_buy');
      testTranslationMapForDic('home_item_info_sub_filter', ['home_action_type_sub_filter']);
      testTranslationMapForDic('home_item_info_action_type', ['home_edit_action_type']);
      testTranslationMapForDic('home_item_info_type_long', ['home_username_info_type']);
    
		if (PATHNAME.endsWith('/hobby/')) {
		  testTranslationMapForDic('home_item_info_type_name', ['x_subtypes_figures']);
		} else if (PATHNAME.endsWith('/hobby/model')) {
		  testTranslationMapForDic('home_item_info_type_name', ['x_subtypes_anime_models']);
		} else if (PATHNAME.endsWith('/hobby/real')) {
		  testTranslationMapForDic('home_item_info_type_name', ['x_subtypes_real_models']);
		} else if (PATHNAME.endsWith('/hobby/moppet')) {
		  testTranslationMapForDic('home_item_info_type_name', ['x_subtypes_plushies']);
		} else if (PATHNAME.endsWith('/hobby/doll')) {
		  testTranslationMapForDic('home_item_info_type_name', ['x_subtypes_dolls']);
		} else if (PATHNAME === '/' || PATHNAME.endsWith('/index') || PATHNAME.endsWith('/user/home')) {
			testTranslationMapForDic('home_item_info_type_name', ['home_image_type_name']);
		}
    }
    
    if (PATHNAME.includes('/hobby/all')) {
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
      testTranslationMapForDic('search_filter_button_group_out_view', ['search_filter_button_group_out_view']);
      testTranslationMap('search_filter_button_display_icon_list');
    	testTranslationMapForDic('search_filter_more_filters_button', ['more_button']);
      testTranslationMap('search_filter_more_filters_button_list');
    	testTranslationMapForDic('search_filter_more_filters_list', ['search_filter_more_filters_button_list']);
    	testTranslationMap('search_modal_window_header');
    	testTranslationMap('search_modal_window_body');
    	testTranslationMap('search_modal_window_footer');
      
      
    }
    if (PATHNAME.includes('/search')) {
      testTranslationMap('search_global_advanced_search_button');
      testTranslationMap('search_global_main_nav');
      testTranslationMapForDic('search_global_result_tags', ['search_global_tags_additional','nav_top_search_drop_list',
                                                'encyclopedia_series_types', 'home_image_type_name']);
      testTranslationMapForDic('search_global_users_stats', ['profile_stats']);
      testTranslationMap('search_global_results_none');
    	testTranslationMap('search_global_page_ibox');
      testTranslationMap('search_global_ibox_description');
  	}
    
	encyclopedia_section.testTranslation();
    
    if (PATHNAME.includes("/hobby/")) {
      testTranslationMap("item_prop");
      testTranslationMap('item_nav');
      testTranslationMapForDic('item_contribution_type', ['item_contribution_type']);
    } else if (PATHNAME.includes("/user/home") || PATHNAME.includes("/index")) {
      testTranslationMap("home_action_type_filter");
      testTranslationMap("home_edit_action_type");
  		testTranslationMapForDic('home_username_info_type', ['home_username_info_type']);
      testTranslationMap('home_image_type_name');
      testTranslationMap('settings_general_form');
      
      // TODO test for search placeholders
    } else if (PATHNAME.includes('/user/edit/')) {
      testTranslationMap('settings_list');
      testTranslationMapForDic('settings_panel_title', ['settings_list']);
    	testTranslationMap('settings_panel_button');
   		testTranslationMap('settings_general_form');
      testTranslationMap('settings_general_form_gender');
      testTranslationMap('settings_block_form');
    	testTranslationMap('settings_block_form_radio');
      testTranslationMap('settings_privacy_headers');
      testTranslationMapForDic('settings_privacy_form', ['settings_privacy_form']);
      testTranslationMap('settings_privacy_form_radio');
      testTranslationMap('settings_password_form');
      testTranslationMap('settings_email_link_avatar_form');
    	testTranslationMap('settings_phone_form');
    	testTranslationMap('settings_avatar_form_button_upload');
   		testTranslationMap('settings_avatar_form_button_cancel');
    }
  
  } catch (e) {
    console.error(e);
  }
  console.log('tests completed');
  });


console.log('script loading finished');  
     
 })();