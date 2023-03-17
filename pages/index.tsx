import Head from "next/head";
import "slick-carousel/slick/slick.css";
import Banner from "../components/Banner";
import BannerBottom from "../components/BannerBottom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { sanityClient, urlFor } from "../sanity";
import { Post } from "../types";
import Image from "next/image";
import Link from "next/link";

interface Props {
  posts: [Post];
}

export default function Home({ posts }: Props) {
  console.log(posts[0]);
  return (
    <div>
      <Head>
        <title>My Blog | Explore the new horizon</title>
        <link rel="icon" href="/smallLogo.ico" />
      </Head>

      <main className="font-bodyFont">
        {/* ============ Header Start here ============ */}
        <Header />
        {/* ============ Header End here ============== */}
        {/* ============ Banner Start here ============ */}
        <Banner />
        {/* ============ Banner End here ============== */}
        <div className="max-w-7xl mx-auto h-60 relative">
          <BannerBottom />
        </div>
        {/* ============ Banner-Bottom End here ======= */}
        {/* ============ Post Part Start here ========= */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 py-6">
          {posts.map((el) => (
            <Link key={el._id} href={`/posts/${el.slug.current}`}>
              <div className="border-[1px] border-secondaryColor border-opacity-40 h-[450px] group">
                <div className="h-3/5 w-full overflow-hidden">
                  <Image
                    width={380}
                    height={350}
                    src={urlFor(el.mainImage).url()!}
                    alt="main-image"
                    className="w-full h-full object-cover brightness-75 group-hover:brightness-100 duration-300 group-hover::scale-110"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
        {/* ============ Post Part End here =========== */}
        {/* ============ Footer Start here============= */}
        <Footer />
        {/* ============ Footer End here ============== */}
      </main>
    </div>
  );
}

export const getServerSideProps = async () => {
  const query = `*[_type=="post"]{
    _id,
      title,
      author->{
        name,image
      },
      description,
      mainImage,
      slug
  }`;
  const posts = await sanityClient.fetch(query);
  return {
    props: { posts },
  };
};

//32:00
