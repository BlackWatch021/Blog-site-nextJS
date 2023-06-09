import { useState } from "react";
import PortableText from "react-portable-text";
import { GetStaticProps } from "next";
import React from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { sanityClient, urlFor } from "../../sanity";
import { Post } from "../../types";
import { useForm, SubmitHandler } from "react-hook-form";
// import comment from "../../personal-blog/schemas/comment";
import { useSession } from "next-auth/react";

interface Props {
  post: Post;
}

type Inputs = {
  _id: string;
  name: string;
  email: string;
  comment: string;
};

const Slug = ({ post }: Props) => {
  const [submitted, setSubmitted] = useState(false);
  const [commentErr, setCommentErr] = useState("");
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    fetch("/api/createComment", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then(() => {
        setSubmitted(true);
      })
      .catch((err) => {
        setSubmitted(false);
      });
  };

  const signInErr = () => {
    if (!session) {
      setCommentErr("Please sign in before commenting!!");
    } else {
      setCommentErr("");
    }
  };

  return (
    <div>
      <Header />
      {/* Hero image */}
      <img
        className="w-full h-96 object-cover"
        src={urlFor(post.mainImage).url()}
        alt="blog-main-image"
      />
      {/* Main article/blog */}
      <div className="max-w-3xl mx-auto mb-10">
        <article className="w-full mx-auto p-5 bg-secondaryColor/10">
          <h1 className="font-titleFont font-medium text-[32px] text-primary border-b-[1px] border-b-cyan-800 mt-10 mb-3">
            {post.title}
          </h1>
          <h2 className="font-bodyFont text-[18pt] text-gray-500 mb-2">
            {post.description}
          </h2>
          <div className="flex items-center gap-2">
            <img
              className="rounded-full w-12 h-12 object-cover bg-red-400"
              src={urlFor(post.author.image).url()}
              alt="author-image"
            />
            <p className="font-bodyFont text-base">
              Blog posted by{" "}
              <span className="font-bold text-secondaryColor">
                {post.author.name}
              </span>{" "}
              - Published at
              {new Date(post.publishedAt).toLocaleDateString()}
            </p>
          </div>
          <div className="mt-10">
            <PortableText
              dataset={process.env.NEXT_PUBLIC_SANITY_DATASET || "production"}
              projectId={
                process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "beey9nk8"
              }
              content={post.body}
              serializers={{
                h1: (props: any) => (
                  <h1
                    className="text-3xl font-bold my-5 font-titleFont"
                    {...props}
                  />
                ),
                h2: (props: any) => (
                  <h2
                    className="text-2xl font-bold my-5 font-titleFont"
                    {...props}
                  />
                ),
                h3: (props: any) => (
                  <h3
                    className="text-2xl font-bold my-5 font-titleFont"
                    {...props}
                  />
                ),
                li: ({ children }: any) => (
                  <li className="ml-4 list-disc">{children}</li>
                ),
                link: ({ href, children }: any) => (
                  <a href={href} className="text-cyan-500 hover:underline">
                    {children}
                  </a>
                ),
              }}
            />
          </div>
        </article>
        <hr className="max-w-lg my-5 mx-auto border[1px] border-secondaryColor" />
        {submitted ? (
          <div className="flex flex-col items-center gap-2 p-10 my-10 bg-bgColor text-white mx-auto">
            <h1 className="text-2xl font-bold">
              Thank you for submitting your comment!
            </h1>
            <p>Once it's approved, then it will appear below.</p>
          </div>
        ) : (
          <div>
            <p className="text-xs text-secondaryColor uppercase font-titleFont font-bold">
              {" "}
              Enjoyed this article
            </p>
            <h3 className="font-titleFont text-3xl font-bold">
              Leave a Comment below!
            </h3>
            <hr className="py-3 mt-2" />
            {/* coment id */}
            <input
              {...register("_id")}
              type="hidden"
              name="_id"
              value={post._id}
            />

            {/* Comment form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-7 flex flex-col gap-6"
            >
              <label className="flex flex-col">
                <span className="font-titleFont font-semibold text-base">
                  Name
                </span>
                <input
                  type="text"
                  placeholder="Enter your name"
                  {...register("name", { required: true })}
                  className=" text-base placeholder:text-sm border-b-[1px] border-secondaryColor py-1 px-4 outline-none focus-within:shadow-xl shadow-secondaryColor"
                />
                {/* error name */}
                {errors.name && (
                  <p className="text-sm font-titleFont font-semibold text-red-500 my-1 px-4">
                    <span className="text-base font-bold italic mr-2">!</span>
                    Name is required
                  </p>
                )}
              </label>
              <label className="flex flex-col">
                <span className="font-titleFont font-semibold text-base">
                  Email
                </span>
                <input
                  type="text"
                  placeholder="Enter your email"
                  {...register("email", { required: true })}
                  className=" text-base placeholder:text-sm border-b-[1px] border-secondaryColor py-1 px-4 outline-none focus-within:shadow-xl shadow-secondaryColor"
                />
                {/* Error email */}
                {errors.email && (
                  <p className="text-sm font-titleFont font-semibold text-red-500 my-1 px-4">
                    <span className="text-base font-bold italic mr-2">!</span>
                    Email is required
                  </p>
                )}
              </label>
              <label className="flex flex-col">
                <span className="font-titleFont font-semibold text-base">
                  Comment
                </span>
                <textarea
                  {...register("comment", { required: true })}
                  placeholder="Enter your Comment"
                  rows={6}
                  className=" text-base placeholder:text-sm border-b-[1px] border-secondaryColor py-1 px-4 outline-none focus-within:shadow-xl shadow-secondaryColor"
                />
                {/* Comment error */}
                {errors.comment && (
                  <p className="text-sm font-titleFont font-semibold text-red-500 my-1 px-4">
                    <span className="text-base font-bold italic mr-2">!</span>
                    Please enter your comment.
                  </p>
                )}
              </label>
              {session && (
                <button
                  type="submit"
                  className="w-full bg-bgColor text-white text-base font-titleFont font-semibold tracking-wide uppercase py-2 rounded-sm hover:bg-secondaryColor duration-300"
                >
                  Comment
                </button>
              )}
            </form>
            {!session && (
              <button
                onClick={signInErr}
                className="w-full bg-bgColor text-white text-base font-titleFont font-semibold tracking-wide uppercase py-2 rounded-sm hover:bg-secondaryColor duration-300"
              >
                Comment
              </button>
            )}
            {commentErr && (
              <p className="text-sm font-titleFont text-center font-semibold text-red-500  my-1 px-4 mt-5">
                <span className="text-base font-bold italic mr-2">
                  {commentErr}
                </span>
              </p>
            )}
            {/* comments */}
            <div className="w-full flex flex-col p-10 my-10 auto shadow-bgColor shadow-lg space-y-2">
              <h3 className="text-3xl font-titleFont font-semibold">
                Comments
              </h3>
              <hr />
              {post.comments.map((el) => (
                <div key={el._id}>
                  <p>
                    <span className="text-secondaryColor">{el.name}</span>{" "}
                    {el.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Slug;

export const getStaticPaths = async () => {
  const query = `*[_type=="post"]{
    _id,   
      slug{
      current
      }
  }`;

  const posts = await sanityClient.fetch(query);
  const paths = posts.map((el: Post) => ({
    params: {
      slug: el.slug.current,
    },
  }));
  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps = async ({ params }: any) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
  _id,
  publishedAt,
  title,
  author ->{
    name,
    image,
  },
  "comments":*[_type == "comment" && post._ref == ^._id && approved == true],
  description,
  mainImage,
  slug,body
 }`;

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  });

  if (!post) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      post,
    },
    revalidate: 60,
  };
};
