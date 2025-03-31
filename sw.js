/**
 * 自动引入模板，在原有 sw-precache 插件默认模板基础上做的二次开发
 *
 * 因为是自定导入的模板，项目一旦生成，不支持随 sw-precache 的版本自动升级。
 * 可以到 Lavas 官网下载 basic 模板内获取最新模板进行替换
 *
 */

/* eslint-disable */

'use strict';

var precacheConfig = [["/404.html","3f1c847c4e4e11dc7a6e6b593757c0f5"],["/archives/2024/07/index.html","1b1792d724f13dfabbc302163f2350e7"],["/archives/2024/index.html","561a62fa1c7f243b235cf5e22499378c"],["/archives/index.html","3056540f8859eaf9e1b5dff7fb29efc5"],["/cat/daily/index.html","d33ac11ee9f4d70e4aadc38996dfdf86"],["/cat/food/index.html","c83c80ce805e152b09f80d368270a27e"],["/cat/health/index.html","4223039eab0a485e9d71b02141e27427"],["/cat/index.html","b62a81d77f1942c58f8cf21ed3b25f28"],["/cat/picture/index.html","38b518c123dada48134bc257a7f90086"],["/categories/index.html","6fc9546ad0a7b103801c6bc214ce3da2"],["/categories/passWorld/index.html","61b28261a1823ec9de7abb95aa6171fc"],["/css/background.css","f38915200dfc20af6fc2c64ec21b25ac"],["/css/hbe.style.css","f1245164f762ee83309fa797a63fb868"],["/css/iconfont.css","e6b72fe5e6d5f3256a49708794fee4d7"],["/css/iconfont.ttf","9dc9e0cac7fb7068a0f74638549a2955"],["/css/iconfont.woff","c4235ac47047d86c77d63d12da75cf3a"],["/css/iconfont.woff2","df674d59d5be495dee29d5d90d19eb7d"],["/css/index.css","8e72a180649f33c8ec2a77cf772cafb9"],["/css/my.css","f17f23b79575cd822977ab55d63c5677"],["/css/var.css","69b443f7ffe31bf9830bd9ffab3d4fe3"],["/index.html","37b8a56b7ab7eab126cbc23069accd62"],["/js/main.js","f30237017b02ee920b1808fe444d98bd"],["/js/search/algolia.js","60c5033c91eb899405fa8517d66a616d"],["/js/search/local-search.js","de5051925fe67ff53ab1e6c14eef062e"],["/js/tw_cn.js","0e69d43d0faeadbdd263ce83bd18a224"],["/js/utils.js","e3907cdcb67aecac06f16afa37052961"],["/js/weather.js","afee0ee199ecf371d2aad387713e5597"],["/lib/hbe.js","cb004426c9bd62ba16e200b048462887"],["/link/index.html","5be7ca23d52a362ee529d378a00d9743"],["/photos/appointment/2023/index.html","458d9412d3abdc55065e7e2911b0d5d2"],["/photos/appointment/2024/index.html","af5336bddda51664288d1ab37903aab6"],["/photos/appointment/index.html","dc57d8a68a0dfe8ccc5a24a0382ae9fa"],["/photos/babyAndBabies/2023/index.html","d3e47576e74235f79b5ab912a4d9cf8c"],["/photos/babyAndBabies/2024/index.html","e68851e80cec447b79cce4aefdabd855"],["/photos/babyAndBabies/index.html","9f4a1cdc9e2f8f336680649ec22e626e"],["/photos/game/index.html","87c9fa991b336b8970133ce3ac7158ce"],["/photos/game/steam/index.html","7229a87d18a184e9c0b7aa064774f99e"],["/photos/game/wzry/index.html","a7bc6796eb8eda624443566bd415de28"],["/photos/index.html","b9079ea0a435795718dfd9dc3361e674"],["/photos/movie/2023/index.html","4be6ca442060370c42ece3043867b373"],["/photos/movie/2024/index.html","5cfb73dc11b2d8c4787d78a95c84fc53"],["/photos/movie/index.html","f7b694d3c6cb078f1f857e706eb7f1ef"],["/photos/ohmygirl/2023/index.html","8bb7df2154074d013fbd09bf137aea6a"],["/photos/ohmygirl/2024/index.html","c189401a1a075dbda4e07a22f4ec95ab"],["/photos/ohmygirl/index.html","cc3210f9577c94d311651525f0808fce"],["/photos/outside/NanJing/index.html","e795875f58106d624d79637379188461"],["/photos/outside/QingDao/index.html","05ef903f603fb3630f2770c9375e5827"],["/photos/outside/ShaoXing/index.html","78385415bea844d0378b3b68c4a29c71"],["/photos/outside/WuHan/index.html","62e37c3b7cc5c5762d20da0664092682"],["/photos/outside/index.html","fa1322c3eced5609c3936d943fbde8d4"],["/posts/15940.html","83b8fd9996115454e63f6b898373ca18"],["/sw-register.js","df7916aea204c72e0ae09e8e9d54336e"],["/tags/index.html","36626dfa20fca1f0369655ae4c4bd728"],["/tags/账号/index.html","ded6ab37eeb98f983067f01f71a55256"]];
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
