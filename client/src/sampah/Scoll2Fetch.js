import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useInfiniteQuery, useQuery } from "react-query";
import useIntersectionObserver from "./hooks/useIntersectionObserver";
import axios from "axios";
import { ReactQueryDevtools } from "react-query-devtools";

const style = {
  height: 30,
  border: "1px solid green",
  margin: 6,
  padding: 8,
};

export default () => {
  // const { isLoading, error, data } = useQuery("fetchLuke", () =>
  //   axios("http://localhost:4002/api/posts/?page=2&limit=6")
  // );
  const fetchProjects = (key, cursor = 1) =>
    axios("http://localhost:4002/api/posts/?limit=6&page=" + cursor);
  const {
    status,
    data,
    error,
    isFetching,
    isFetchingMore,
    fetchMore,
    canFetchMore,
  } = useInfiniteQuery("projects", fetchProjects, {
    getFetchMore: (lastGroup, allGroups) => lastGroup.nextCursor,
  });

  // console.log(data.docs);
  if (data) {
    console.log(data[0].data.docs);
    // data[0].data.docs.map((group) => {
    //   console.log(group);
    // });
  }

  const loadMoreButtonRef = React.useRef();

  useIntersectionObserver({
    target: loadMoreButtonRef,
    onIntersect: fetchMore,
    enabled: canFetchMore,
  });

  return status === "loading" ? (
    <p>Loading...</p>
  ) : status === "error" ? (
    <p>Error: {error.message}</p>
  ) : (
    <>
      {data[0].data.docs.map((group, i) => (
        <React.Fragment key={i}>
          <p key={group.id}>{group.testing}</p>
        </React.Fragment>
      ))}
      <div>
        <button
          ref={loadMoreButtonRef}
          onClick={() => fetchMore()}
          disabled={!canFetchMore || isFetchingMore}
        >
          {isFetchingMore
            ? "Loading more..."
            : canFetchMore
            ? "Load More"
            : "Nothing more to load"}
        </button>
      </div>
      <div>{isFetching && !isFetchingMore ? "Fetching..." : null}</div>
      <ReactQueryDevtools initialIsOpen />
    </>
  );

  // console.log(error);
  // return status === "loading" ? (
  //   <p>Loading...</p>
  // ) : status === "error" ? (
  //   <p>Error: {error.message}</p>
  // ) : (
  //   <>
  //     {data.map((group, i) => (
  //       <React.Fragment key={i}>
  //         {group.docs.map((project) => (
  //           <p key={project.id}>{project.title}</p>
  //         ))}
  //       </React.Fragment>
  //     ))}
  //     <div>
  //       <button
  //         onClick={() => fetchMore()}
  //         disabled={!canFetchMore || isFetchingMore}
  //       >
  //         {isFetchingMore
  //           ? "Loading more..."
  //           : canFetchMore
  //           ? "Load More"
  //           : "Nothing more to load"}
  //       </button>
  //     </div>
  //     <div>{isFetching && !isFetchingMore ? "Fetching..." : null}</div>
  //   </>
  // );
};

// const Scroll2Fetch = () => {
//   const [items, setItems] = useState(Array.from({ length: 20 }));
//   const [hasMore, setHasMore] = useState(true);

//   const fetchMoredata = () => {
//     if (items.length >= 80) {
//       setHasMore(false);
//       return;
//     }

//     setTimeout(() => {
//       setItems((prevItems) => prevItems.concat(Array.from({ length: 20 })));
//     }, 5000);
//   };

//   return (
//     <div>
//       <br />
//       <br />
//       <br />
//       <br />

//       <InfiniteScroll
//         dataLength={items.length}
//         next={fetchMoredata}
//         hasMore={hasMore}
//         loader={<h4>Loading...</h4>}
//         endMessage={
//           <p style={{ textAlign: "center" }}>
//             <b>Yay! You have seen it all</b>
//           </p>
//         }
//       >
//         {items.map((i, index) => (
//           <div style={style} key={index}>
//             div - #{index}
//           </div>
//         ))}
//       </InfiniteScroll>
//     </div>
//   );
// };

// export default Scroll2Fetch;
