import React, { ReactElement, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { API } from "aws-amplify";
import { getPost } from "../../graphql/queries";
import {
  GetPostQuery,
  Post,
  CreateCommentInput,
  CreateCommentMutation,
  Comment,
} from "../../API";
import PostPreview from "../../components/PostPreview";
import { Button, Container, TextField } from "@material-ui/core";
import PostComment from "../../components/PostComment";
import { useForm, SubmitHandler } from "react-hook-form";
import { Grid } from "@material-ui/core";
import { createComment } from "../../graphql/mutations";

interface IFormInput {
  comment: string;
}

export default function IndividualPost(): ReactElement {
  const router = useRouter();
  const { id } = router.query; // Getting the post ID from the URL
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    if (!post) return;

    const newCommentInput: CreateCommentInput = {
      postID: post.id,
      content: data.comment,
    };
    // Add Comment Mutation
    const createNewComment = (await API.graphql({
      query: createComment,
      variables: { input: newCommentInput },
    })) as { data: CreateCommentMutation };

    // If comments is undefined, set it to an empty array.
    if (!comments) {
      setComments([createNewComment.data.createComment as Comment]);
    } else {
      setComments([
        ...comments,
        createNewComment.data.createComment as Comment,
      ]);
    }
  };

  useEffect(() => {
    console.log("id", id);
    if (!id) return; // If id is not available yet, return immediately.
    const fetchPost = async () => {
      const postsQuery = (await API.graphql({
        query: getPost,
        variables: {
          id: id,
        },
      })) as { data: GetPostQuery };
      const fetchedPost = postsQuery.data.getPost as Post;
      console.log("fetchedPost", fetchedPost);
      setPost(fetchedPost);
      setComments(fetchedPost.comments.items as Comment[]);
    };

    fetchPost();
  }, [id]); // Re-run effect when `id` changes
  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="md">
      <PostPreview post={post} />
      {/* Start rendering comments */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        style={{ marginTop: 32, marginBottom: 32 }}
      >
        <Grid container spacing={2} direction="row" alignItems="center">
          <Grid item style={{ flexGrow: 1 }}>
            <TextField
              variant="outlined"
              id="comment"
              label="Add A Comment"
              type="text"
              multiline
              fullWidth
              error={errors.comment ? true : false}
              helperText={errors.comment ? errors.comment.message : null}
              {...register("comment", {
                required: { value: true, message: "Please enter a username." },
                maxLength: {
                  value: 240,
                  message: "Please enter a comment under 240 characters.",
                },
              })}
              style={{ width: "100%" }}
            />
          </Grid>
          <Grid item>
            <Button variant="contained" color="default" type="submit">
              Add Comment
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* TODO: Sort comments by createdDate */}
      {comments
        ? comments
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
            .map((comment) => (
              <PostComment key={comment.id} comment={comment} />
            ))
        : null}
    </Container>
  );
}
