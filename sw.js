/**
 * 自动引入模板，在原有 sw-precache 插件默认模板基础上做的二次开发
 *
 * 因为是自定导入的模板，项目一旦生成，不支持随 sw-precache 的版本自动升级。
 * 可以到 Lavas 官网下载 basic 模板内获取最新模板进行替换
 *
 */

/* eslint-disable */

'use strict';

var precacheConfig = [["/404.html","2968f3b41f8312c7b6dd7adb968b37d8"],["/archives/2024/07/index.html","1bddbb62b478b57264b6b6ef901792ad"],["/archives/2024/index.html","6e84673334aea1845b7a8558a5aab535"],["/archives/index.html","67019c55abe86cf396c139bc3bdb3177"],["/cat/daily/index.html","6d9afdf91c21226765c299dfe9c4a52c"],["/cat/food/index.html","1f0f68f845f61579df30cf0496d3c4f0"],["/cat/health/index.html","e43461e9829fe403be970663e08cbcbf"],["/cat/index.html","fc7f4f56ad2c1f6bddcabca2609b5ba6"],["/cat/picture/index.html","496eafcc0ee812731b10aec425d8bf04"],["/categories/index.html","4a31dd41c88e223b21491b1e036af408"],["/categories/passWorld/index.html","d1ed41f1412a093cb354e25847d91c5c"],["/css/background.css","056b929fa3e87ae84a3d683793fe4561"],["/css/hbe.style.css","f1245164f762ee83309fa797a63fb868"],["/css/iconfont.css","4c57dca84aad9bd4b26cd9a1b2b608d2"],["/css/iconfont.ttf","9dc9e0cac7fb7068a0f74638549a2955"],["/css/iconfont.woff","c4235ac47047d86c77d63d12da75cf3a"],["/css/iconfont.woff2","df674d59d5be495dee29d5d90d19eb7d"],["/css/index.css","4ccb9345fa31ca06fc34ac3157efb7ab"],["/css/my.css","8a2e07158c8f631080e53cb013ce2ea6"],["/css/var.css","690ab2cc0854c2424cbe0dace8354991"],["/index.html","b31db210a23cde22f82d635f08bc7dcd"],["/js/main.js","f30237017b02ee920b1808fe444d98bd"],["/js/search/algolia.js","60c5033c91eb899405fa8517d66a616d"],["/js/search/local-search.js","de5051925fe67ff53ab1e6c14eef062e"],["/js/tw_cn.js","0e69d43d0faeadbdd263ce83bd18a224"],["/js/utils.js","e3907cdcb67aecac06f16afa37052961"],["/js/weather.js","afee0ee199ecf371d2aad387713e5597"],["/lib/hbe.js","cb004426c9bd62ba16e200b048462887"],["/link/index.html","c672b2904ab2799eb8a9afe2353e1a16"],["/photos/appointment/2023/index.html","94a4298efeea6f5ec9157823b25b3de3"],["/photos/appointment/2024/index.html","4e27b2e38641c60aaf20385ebbf5b108"],["/photos/appointment/index.html","378fca537b2af3984dce07ed8ae02b97"],["/photos/babyAndBabies/2023/index.html","de856582b594eac8963e2859c50ba8c4"],["/photos/babyAndBabies/2024/index.html","b310e75444efed784e4cfd688ba81d4c"],["/photos/babyAndBabies/index.html","7f0306d7645d7e71307cd92dec6132ec"],["/photos/game/dzpd/index.html","eec35fdbb2d21b41bdf6f1ef619dd33e"],["/photos/game/gy/index.html","07a5d396387237dbdfcccb5f44b98e21"],["/photos/game/index.html","df884bbf8d0f09cf540ff486fa359bc3"],["/photos/game/steam/index.html","8f8414ac39b189d46f138765bd105c55"],["/photos/game/wzry/index.html","02e32697ec25c67e3964df09fcf910d5"],["/photos/index.html","6a0930899f3497867c8aa022ff4f181a"],["/photos/movie/2023/index.html","a05b345798d37a2bb1c0900c2f902d97"],["/photos/movie/2024/index.html","d61a62a3deb30095ebf4de1d11823004"],["/photos/movie/index.html","3922b7c08b677feacce3a0676332e89b"],["/photos/ohmygirl/2023/index.html","91a1971bc81cddaaf553c0505854bc98"],["/photos/ohmygirl/2024/index.html","a0b03716220cf8821fc13913418ed559"],["/photos/ohmygirl/index.html","cf5ba119bec2a62e757dac6c598f8459"],["/photos/outside/NanJing/index.html","bfe8748cb248ade97f91f379e1c47b2f"],["/photos/outside/QingDao/index.html","fad7824070be47169380d87eaeadc789"],["/photos/outside/ShaoXing/index.html","281fd22fc7d1a52fad192686b5e94b53"],["/photos/outside/WuHan/index.html","170b6919b44801228b0d18681246d76c"],["/photos/outside/index.html","9e58cd50d8187b4459242a8345fd5bf2"],["/posts/15940.html","288e57fbf20f34a23727f0d733a4af56"],["/sw-register.js","aa0061bd1c67d63f2663ba5f85258229"],["/tags/index.html","c219b11120002464a9bbe4f16e923b37"],["/tags/账号/index.html","21ca9dd87845f85fd1ef66e29b8eab1a"]];
var cacheName = 'sw-precache-v3--' + (self.registration ? self.registration.scope : '');
var firstRegister = 1; // 默认1是首次安装SW， 0是SW更新


var ignoreUrlParametersMatching = [/^utm_/];


var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
        url.pathname += index;
    }
    return url.toString();
};

var cleanResponse = function (originalResponse) {
    // 如果没有重定向响应，不需干啥
    if (!originalResponse.redirected) {
        return Promise.resolve(originalResponse);
    }

    // Firefox 50 及以下不知处 Response.body 流, 所以我们需要读取整个body以blob形式返回。
    var bodyPromise = 'body' in originalResponse ?
        Promise.resolve(originalResponse.body) :
        originalResponse.blob();

    return bodyPromise.then(function (body) {
        // new Response() 可同时支持 stream or Blob.
        return new Response(body, {
            headers: originalResponse.headers,
            status: originalResponse.status,
            statusText: originalResponse.statusText
        });
    });
};

var createCacheKey = function (originalUrl, paramName, paramValue,
    dontCacheBustUrlsMatching) {

    // 创建一个新的URL对象，避免影响原始URL
    var url = new URL(originalUrl);

    // 如果 dontCacheBustUrlsMatching 值没有设置，或是没有匹配到，将值拼接到url.serach后
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
        url.search += (url.search ? '&' : '') +
            encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
};

var isPathWhitelisted = function (whitelist, absoluteUrlString) {
    // 如果 whitelist 是空数组，则认为全部都在白名单内
    if (whitelist.length === 0) {
        return true;
    }

    // 否则逐个匹配正则匹配并返回
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function (whitelistedPathRegex) {
        return path.match(whitelistedPathRegex);
    });
};

var stripIgnoredUrlParameters = function (originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // 移除 hash; 查看 https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // 是否包含 '?'
        .split('&') // 分割成数组 'key=value' 的形式
        .map(function (kv) {
            return kv.split('='); // 分割每个 'key=value' 字符串成 [key, value] 形式
        })
        .filter(function (kv) {
            return ignoreUrlParametersMatching.every(function (ignoredRegex) {
                return !ignoredRegex.test(kv[0]); // 如果 key 没有匹配到任何忽略参数正则，就 Return true
            });
        })
        .map(function (kv) {
            return kv.join('='); // 重新把 [key, value] 格式转换为 'key=value' 字符串
        })
        .join('&'); // 将所有参数 'key=value' 以 '&' 拼接

    return url.toString();
};


var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
        url.pathname += index;
    }
    return url.toString();
};

var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
    precacheConfig.map(function (item) {
        var relativeUrl = item[0];
        var hash = item[1];
        var absoluteUrl = new URL(relativeUrl, self.location);
        var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
        return [absoluteUrl.toString(), cacheKey];
    })
);

function setOfCachedUrls(cache) {
    return cache.keys().then(function (requests) {
        // 如果原cacheName中没有缓存任何收，就默认是首次安装，否则认为是SW更新
        if (requests && requests.length > 0) {
            firstRegister = 0; // SW更新
        }
        return requests.map(function (request) {
            return request.url;
        });
    }).then(function (urls) {
        return new Set(urls);
    });
}

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(cacheName).then(function (cache) {
            return setOfCachedUrls(cache).then(function (cachedUrls) {
                return Promise.all(
                    Array.from(urlsToCacheKeys.values()).map(function (cacheKey) {
                        // 如果缓存中没有匹配到cacheKey，添加进去
                        if (!cachedUrls.has(cacheKey)) {
                            var request = new Request(cacheKey, { credentials: 'same-origin' });
                            return fetch(request).then(function (response) {
                                // 只要返回200才能继续，否则直接抛错
                                if (!response.ok) {
                                    throw new Error('Request for ' + cacheKey + ' returned a ' +
                                        'response with status ' + response.status);
                                }

                                return cleanResponse(response).then(function (responseToCache) {
                                    return cache.put(cacheKey, responseToCache);
                                });
                            });
                        }
                    })
                );
            });
        })
            .then(function () {
            
            // 强制 SW 状态 installing -> activate
            return self.skipWaiting();
            
        })
    );
});

self.addEventListener('activate', function (event) {
    var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

    event.waitUntil(
        caches.open(cacheName).then(function (cache) {
            return cache.keys().then(function (existingRequests) {
                return Promise.all(
                    existingRequests.map(function (existingRequest) {
                        // 删除原缓存中相同键值内容
                        if (!setOfExpectedUrls.has(existingRequest.url)) {
                            return cache.delete(existingRequest);
                        }
                    })
                );
            });
        }).then(function () {
            
            return self.clients.claim();
            
        }).then(function () {
                // 如果是首次安装 SW 时, 不发送更新消息（是否是首次安装，通过指定cacheName 中是否有缓存信息判断）
                // 如果不是首次安装，则是内容有更新，需要通知页面重载更新
                if (!firstRegister) {
                    return self.clients.matchAll()
                        .then(function (clients) {
                            if (clients && clients.length) {
                                clients.forEach(function (client) {
                                    client.postMessage('sw.update');
                                })
                            }
                        })
                }
            })
    );
});



    self.addEventListener('fetch', function (event) {
        if (event.request.method === 'GET') {

            // 是否应该 event.respondWith()，需要我们逐步的判断
            // 而且也方便了后期做特殊的特殊
            var shouldRespond;


            // 首先去除已配置的忽略参数及hash
            // 查看缓存简直中是否包含该请求，包含就将shouldRespond 设为true
            var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
            shouldRespond = urlsToCacheKeys.has(url);

            // 如果 shouldRespond 是 false, 我们在url后默认增加 'index.html'
            // (或者是你在配置文件中自行配置的 directoryIndex 参数值)，继续查找缓存列表
            var directoryIndex = 'index.html';
            if (!shouldRespond && directoryIndex) {
                url = addDirectoryIndex(url, directoryIndex);
                shouldRespond = urlsToCacheKeys.has(url);
            }

            // 如果 shouldRespond 仍是 false，检查是否是navigation
            // request， 如果是的话，判断是否能与 navigateFallbackWhitelist 正则列表匹配
            var navigateFallback = '';
            if (!shouldRespond &&
                navigateFallback &&
                (event.request.mode === 'navigate') &&
                isPathWhitelisted([], event.request.url)
            ) {
                url = new URL(navigateFallback, self.location).toString();
                shouldRespond = urlsToCacheKeys.has(url);
            }

            // 如果 shouldRespond 被置为 true
            // 则 event.respondWith()匹配缓存返回结果，匹配不成就直接请求.
            if (shouldRespond) {
                event.respondWith(
                    caches.open(cacheName).then(function (cache) {
                        return cache.match(urlsToCacheKeys.get(url)).then(function (response) {
                            if (response) {
                                return response;
                            }
                            throw Error('The cached response that was expected is missing.');
                        });
                    }).catch(function (e) {
                        // 如果捕获到异常错误，直接返回 fetch() 请求资源
                        console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
                        return fetch(event.request);
                    })
                );
            }
        }
    });









/* eslint-enable */
