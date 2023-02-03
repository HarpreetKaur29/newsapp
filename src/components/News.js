import React, {useEffect, useState} from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const News =(props)=> {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
 
  
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

 
  const  updateNews = async()=> {
    props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=5b2ac8e3918f40a1b4be5580d96c6963&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true);
    let data = await fetch(url);
    props.setProgress(30);
    let parsedData = await data.json();
    props.setProgress(70);
    setArticles(parsedData.articles);
    setTotalResults(parsedData.totalResults);
    setLoading(false);
    props.setProgress(100);
  }
   
  useEffect(() => {
     document.title = `${capitalizeFirstLetter(props.category)} - NewsMonkey`;
    updateNews();
  }, [])
  

   const handlePreviousClick = async () => {
    setPage(page+1);
    updateNews();
  };

  const handleNextClick = async () => {
    setPage(page-1);
    updateNews();
  };
     const fetchMoreData = async() => {
    
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=5b2ac8e3918f40a1b4be5580d96c6963&page=${page+1}&pageSize=${props.pageSize}`;
    setPage(page+1);
   
    let data = await fetch(url);
    let parsedData = await data.json();
    console.log({TR : parsedData.totalResults})
    console.log(parsedData);
    setArticles(articles.concat(parsedData.articles));
    setTotalResults(parsedData.totalResults);
  };


    return (
      <>
        <h1 className="text-center" style={{ margin: "35px 0px", marginTop:'90px'  }}>
          NewsMonkey - Top Headlines {capitalizeFirstLetter(props.category)} Headlines 
        </h1>
        {loading && <Spinner/>}
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={(articles.length - 15) !== totalResults}
          loader={<Spinner/>}
        > 
          <div className="container">
          <div className="row">
            {articles.map((element, index) => {
              return (
                <div className="col-md-4 mb-4" key={index}>
                  <NewsItem
                    title={element.title ? element.title.slice(0, 48) : ""}
                    description={
                      element.description
                        ? element.description.slice(0, 91)
                        : ""
                    }
                    imageUrl={element.urlToImage}
                    newsUrl={element.url}
                    author={element.author}
                    date={element.publishedAt}
                    source={element.source.name}
                  />
                </div>
              );
            })}
          </div>
          </div>
        </InfiniteScroll>
{/*        <div className="container d-flex justify-content-between">
          <button
            disabled={page <= 1}
            type="button"
            className="btn btn-dark"
            onClick={handlePreviousClick}
          >
            {" "}
            &larr; Previous
          </button>
          <button
            disabled={
              page + 1 >
              Math.ceil(totalResults / props.pageSize)
            }
            type="button"
            className="btn btn-dark"
            onClick={handleNextClick}
          >
            Next &rarr;
          </button>
          </div>*/}
      </>
    );
  
}
News.defaultProps = {
  country: "in",
  pageSize: 15,
  category: "general",
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};

export default News;
