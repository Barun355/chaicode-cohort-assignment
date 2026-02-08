const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

console.log("hello");

const posts = [];
const publicationId = "blog.baruntiwary.dev"; // Replace with your actual publication ID

const fetchPosts = async () => {
  try {
    const data = await fetchTopBlogPosts(publicationId);

    const posts = data.map((edge) => edge.node);
    console.log(posts)
    generateArticles(posts);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
  } finally {
  }
};

fetchPosts();

async function fetchTopBlogPosts(publicationId) {
  const GET_USER_ARTICLES_URL = `
  query GetPublicationArticles($host: String!, $first: Int!) {
        publication(host: $host) {
          title
          posts(first: $first) {
            edges {
              node {
                title
                brief
                slug
                publishedAt
                updatedAt
                coverImage {
                  url
                }
                readTimeInMinutes
              }
            }
          }
        }
      }
  `;

  const variables = {
    host: publicationId,
    first: 3,
  };

  const response = await fetch("https://gql.hashnode.com/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: GET_USER_ARTICLES_URL, variables }),
  });

  const result = await response.json();
  const posts = result.data.publication.posts.edges;
  return posts;
}

function generateArticles(posts) {
  var articles = ``;
  for (const post of posts) {
    const article = getPostHTML(post);
    articles += article;
  }

  console.log('Article: ', articles)
  document.querySelector("#blogs .blogs").innerHTML = articles;
}

function getPostHTML(post) {
  const { title, brief, slug, publishedAt, coverImage, readTimeInMinutes } = post;
  return `
<article id="blog" class="blog-post">
  <div class="upper">
    <img src="${coverImage?.url || 'images/portfolio.webp'}" alt="alt from hashnode" width="400px" height="200px">
    <div class="meta">
        <div class="datetime">
            <svg style="width: 1rem; height: 1rem;" fill="#fff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                <!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M216 64C229.3 64 240 74.7 240 88L240 128L400 128L400 88C400 74.7 410.7 64 424 64C437.3 64 448 74.7 448 88L448 128L480 128C515.3 128 544 156.7 544 192L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 192C96 156.7 124.7 128 160 128L192 128L192 88C192 74.7 202.7 64 216 64zM216 176L160 176C151.2 176 144 183.2 144 192L144 240L496 240L496 192C496 183.2 488.8 176 480 176L216 176zM144 288L144 480C144 488.8 151.2 496 160 496L480 496C488.8 496 496 488.8 496 480L496 288L144 288z"/>

            </svg>
            <time datetime="${publishedAt}">${formatDate(publishedAt)}</time>
        </div>
        <div class="readtime">
            <svg style="width: 1rem; height: 1rem;" fill="#fff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                <!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M528 320C528 434.9 434.9 528 320 528C205.1 528 112 434.9 112 320C112 205.1 205.1 112 320 112C434.9 112 528 205.1 528 320zM64 320C64 461.4 178.6 576 320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320zM296 184L296 320C296 328 300 335.5 306.7 340L402.7 404C413.7 411.4 428.6 408.4 436 397.3C443.4 386.2 440.4 371.4 429.3 364L344 307.2L344 184C344 170.7 333.3 160 320 160C306.7 160 296 170.7 296 184z"/>
            </svg>
            <span>${readTimeInMinutes} min read</span>
        </div>
    </div>
  </div>
  <div class="lower">
    <h3><a href="${slug}">${title}</a></h3>
    <p>${brief}</p>
  </div>
</article>
  `;
}
