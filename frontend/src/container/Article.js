import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import NotFound from '../container/NotFound';

import { fetchArticle } from '../action/article';

function Article(props) {
  const articleID = props.match.params.id;
  const { article, fetchArticle, error } = props;

  useEffect(() => {
    fetchArticle(articleID);
  }, [fetchArticle, articleID]);

  if (error == null) {
    return (
      <div>
        <div
          classname="article-view"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
        {/* TODO : comments */}
      </div>
    )
  }
  return (
    <NotFound />
  )
}

const mapStateToProps = (state) => ({
  article: state.article.article,
  error: state.article.error,
});

const mapDispatchToProps = (dispatch) => ({
  fetchArticle: (id) => dispatch(fetchArticle(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Article);
