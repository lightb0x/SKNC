import React from 'react';
import { connect } from 'react-redux';
import Image from 'react-bootstrap/Image';

import BoardEntry from '../component/BoardEntry';

import { fetchArticleList } from '../action/article';

// TODO : get articles from DB, using props.numArticles
function Home(props) {
  console.log('before')
  props.fetch(10);
  console.log('after')
  console.log(props.storedArticle)
  return (
    <div>
      <Image
        src="sknc.jpg" alt="sknc"
        style={{
          // image does not go out of view
          maxWidth: "100%",
          // image size cap
          maxHeight: "500px",
          // horizontal center
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      />
      {/* what's new OR recommended OR trending OR random article for you 
          OR ... */}
      <BoardEntry boardName={"what's new"} articles={[]} />
    </div>
  )
}

const mapStateToProps = (state) => ({
  storedArticle: state.article.article,
});

const mapDispatchToProps = (dispatch) => ({
  fetch: (id) => dispatch(
    fetchArticleList(id),
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);
