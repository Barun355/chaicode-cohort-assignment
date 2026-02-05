const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const posts = [];
const publicationId = "blog.baruntiwary.dev"; // Replace with your actual publication ID

const fetchPosts = async () => {
  try {
    const data = await fetchTopBlogPosts(publicationId);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
  } finally {
  }
};
