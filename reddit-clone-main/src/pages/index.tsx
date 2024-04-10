import React, { useEffect, useState } from "react";
import { Typography, Container } from "@material-ui/core";
import { API } from "aws-amplify";
import { useUser } from "../context/AuthContext";
import { listPosts } from "../graphql/queries";
import { ListPostsQuery, Post } from "../API";
import PostPreview from "../components/PostPreview";

export default function Home() {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPostsFromApi = async (): Promise<void> => {
      try {
        const allPosts = (await API.graphql({ query: listPosts })) as {
          data: ListPostsQuery;
          errors: any[];
        };

        if (
          allPosts.data &&
          allPosts.data.listPosts &&
          Array.isArray(allPosts.data.listPosts.items)
        ) {
          setPosts(allPosts.data.listPosts.items);
        } else {
          console.error("无法获取帖子数据");
        }
      } catch (error) {
        console.error("获取帖子时发生错误:", error);
      }
    };

    fetchPostsFromApi();
  }, []);

  return (
    <Container maxWidth="md">
      {posts.map((post) =>
        post && post.id ? <PostPreview key={post.id} post={post} /> : null
      )}
    </Container>
  );
}
