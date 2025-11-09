const parse = (csv) => {
  /*
  Rating	ID	Title	Title ZH	Title Slug	Contest Slug	Problem Index
  3018.4940165727	1719	Number Of Ways To Reconstruct A Tree	重构一棵树的方案数	number-of-ways-to-reconstruct-a-tree	biweekly-contest-43	Q4
  2872.0290327119	1982	Find Array Given Subset Sums	从子集的和还原数组	find-array-given-subset-sums	weekly-contest-255	Q4
  */

  let lines = csv.split('\n'); // split rows by newline
  let headers = lines[0].split(/\t+/); // first row is headers, split cols by tab

  let json = {};
  for (let i = 1; i < lines.length; i++) {
    let row = lines[i].split(/\t+/); // data, split cols by tab
    // ID as key
    json[row[1]] = Object.fromEntries(headers.map((k, i) => [k, row[i]]));
  }

  return json;
};

const getRatings = async () => {
  const expire = 3600 * 24 * 1000; // cache for 1 day

  let items = await chrome.storage.local.get(['ratings', 'cacheTime']);
  if (
    items.ratings &&
    items.cacheTime &&
    Date.now() < items.cacheTime + expire
  ) {
    return items.ratings;
  }

  let ratings = parse(
    await fetch(
      'https://raw.githubusercontent.com/zerotrac/leetcode_problem_rating/main/ratings.txt'
    ).then((res) => res.text())
  );

  await chrome.storage.local.set({ ratings: ratings, cacheTime: Date.now() });

  return ratings;
};

const getClistRatings = async () => {
  const expire = 3600 * 24 * 1000; // cache for 1 day

  let items = await chrome.storage.local.get(['clistRatings', 'clistCacheTime', 'clistApiKey', 'clistUsername']);

  if (
    items.clistRatings &&
    items.clistCacheTime &&
    Date.now() < items.clistCacheTime + expire
  ) {
    return items.clistRatings;
  }

  if (!items.clistApiKey || !items.clistUsername) return {};

  const baseUrl = 'https://clist.by:443/api/v4/problem/?resource_id=102&limit=1000';
  const clistRatings = {};

  async function doFetch(offset) {
    return await fetch(`${baseUrl}&offset=${offset}`, { headers: { Authorization: `ApiKey ${items.clistUsername}:${items.clistApiKey}` } })
      .then((res) => res.json());
  }

  let offset = 0;
  let result = await doFetch(offset);

  while (result.objects.length > 0) {
    result.objects.forEach((problem) => {
      clistRatings[problem.slug] = {
        id: problem.id,
        rating: problem.rating || 'N/A',
        name: problem.name,
      };
    });

    offset += result.objects.length;
    result = await doFetch(offset);
  }

  await chrome.storage.local.set({ clistRatings, clistCacheTime: Date.now() });

  return clistRatings;
};

const replace = (ratings, clistRatings, id, slug, difficulty, showNA) => {
  if (!id || !slug || !difficulty) return;
  const availableRatings = [];

  const zerotracRating = ratings[id]?.Rating?.split('.')[0];
  if (zerotracRating) {
    availableRatings.push(`Z ${zerotracRating}`);
  }

  const clistRating = clistRatings[slug]?.rating;
  if (clistRating && clistRating !== 'N/A') {
    availableRatings.push(`C ${clistRating}`);
  }

  if (availableRatings.length === 0 && !showNA) return;

  let ratingToShow = 'N/A';
  if (availableRatings.length > 0) {
    ratingToShow = availableRatings.join(', ');
  }

  difficulty.textContent = ratingToShow;
};

const update = async () => {
  observer.disconnect();

  let ratings = await getRatings();
  let clistRatings = await getClistRatings();
  let showNA = (await chrome.storage.local.get('showNA')).showNA;

  let title;
  let difficulty;
  let id;
  let slug;

  // leetcode.com/problemset/* and leetcode.cn/problemset/*
  document.querySelectorAll('[role="row"]').forEach((ele) => {
    title = ele.querySelector('[role="cell"]:nth-child(2) a');
    difficulty = ele.querySelector('[role="cell"]:nth-child(5) span');
    replace(ratings, clistRatings, id, slug, difficulty, showNA);
  });

  // new leetcode.com/problems/*/
  title = document.querySelector('div > a.text-lg.text-label-1.font-medium');
  difficulty = document.querySelector(
    'div > div.text-sm.font-medium.capitalize'
  );
  replace(ratings, clistRatings, id, slug, difficulty, showNA);

  // old leetcode.com/problems/*/
  title = document.querySelector('div[data-cy="question-title"]');
  difficulty = document.querySelector(
    'div[diff="easy"],div[diff="medium"],div[diff="hard"]'
  );
  replace(ratings, clistRatings, id, slug, difficulty, showNA);

  // leetcode.cn/problems/*/
  title = document.querySelector('div[class^="text-title-"]');
  difficulty = document.querySelector('div[class*="text-difficulty-"]');
  id = title?.textContent.split('.')[0];
  slug = title?.querySelector('a').getAttribute('href')?.split('/problems/')[1]?.replace('/', '');
  replace(ratings, clistRatings, id, slug, difficulty, showNA);

  // leetcode.com/problem-list/*/
  document
    .querySelectorAll('div > a.group.flex-col, div > div.group.flex-col')
    .forEach((ele) => {
      id = ele.getAttribute('id');
      slug = ele.getAttribute('href')?.match('/problems/([^/?]+)')[1];
      title = ele.querySelector('.ellipsis.line-clamp-1');
      difficulty = ele.querySelector('p[class*="text-sd-"]');
      replace(ratings, clistRatings, id, slug, difficulty, showNA);
    });

  observer.observe(document.body, {
    subtree: true,
    childList: true,
  });
};

let timer;
const debounce = (func, timeout) => {
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), timeout);
  };
};

const observer = new MutationObserver((mutations) => {
  mutations.forEach(debounce(update, 300));
});

if (
  document.location.href.match(
    /^https?:\/\/(www.)?leetcode.(com|cn)\/(problemset|problems|problem-list)/
  )
) {
  observer.observe(document.body, {
    subtree: true,
    childList: true,
  });
}
