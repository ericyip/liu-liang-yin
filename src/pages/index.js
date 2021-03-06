import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import PropTypes from 'prop-types';
import Link from 'gatsby-link';
import { Transition, animated, interpolate } from 'react-spring';

import Navbar, { NavItem } from '../components/Navbar';
import { HTMLContent } from '../components/Content';
import Footer from '../components/Footer';
import { AboutPageTemplate } from '../templates/about-page';

const Content = styled.div`
  position: absolute;
  right: 100px;
  top: 150px;

  @media (max-width: 1024px) {
    max-width: 330px;
    right: 130px;
  }

  @media (max-width: 768px) {
    right: unset;
    left: 50%;
    transform: translateX(-50%);
    ${'' /* max-width: 540px; */};
  }

  @media (max-width: 480px) {
    padding-left: 40px;
    padding-right: 40px;
    max-width: unset;
  }
`;

const SubMenu = styled.ul`
  position: absolute;
  left: 216px;
  top: 150px;

  ${({ isPadSize }) =>
    isPadSize &&
    css`
      top: 120px;
      left: 75px;
    `};

  @media (max-width: 480px) {
    left: 45px;
  }
`;

const BackButton = styled.div`
  font-size: 18px;
  padding-left: 27.5px;
  display: none;
  maring-top: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  font-weight: 500;

  :before {
    content: '<';
    position: absolute;
    left: 7.5px;
  }

  :hover {
    opacity: 0.3;
  }

  @media (max-width: 768px) {
    display: block;
  }
`;

const ProjectLi = styled.li`
  line-height: 17px;
  padding: 7.5px;
  font-size: 14px;
  cursor: pointer;
  transition: transform 350ms cubic-bezier(0.68, -0.55, 0.265, 1.55);

  @media (max-width: 768px) {
    padding-top: 10px;
    padding-bottom: 10px;
  }

  @media (max-width: 480px) {
    line-height: 33px;
    font-weight: 500;
  }

  :hover {
    transform: rotateX(720deg);
  }
`;

const ProjectYear = styled.div`
  font-size: 12px;
  font-weight: 300;
  color: #000;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const ProjectName = styled.div`
  font-size: 14px;
  padding-left: 10px;
  color: #000;

  @media (max-width: 480px) {
    max-width: 200px;
    font-size: 18px;
  }
`;

const BackgroundImageWrapper = styled.div`
  position: fixed;
  right: 0;
  bottom: 0;
  z-index: -1;
  top: 0;
  left: 330px;

  @media (max-width: 900px) {
    left: 0;
    top: 0;
  }
  @media (max-width: 768px) {
    display: none;
  }
`;

export default class IndexPage extends React.Component {
  state = {
    activeIndex: this.props.location.state || 'project',
    backgroundImage: null,
    showImage: false,
    isPadSize: false,
  };

  componentDidMount() {
    this.updateMenu();
    window.addEventListener('resize', this.updateMenu);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateMenu);
  }

  updateMenu = () => {
    if (this.wrapper.offsetWidth < 768) {
      if (!this.state.isPadSize) {
        this.setState({
          isPadSize: true,
          activeIndex: this.props.location.state || null,
        });
      }
    } else {
      if (this.state.isPadSize) {
        this.setState({ isPadSize: false });
      }
    }
  };

  onActiveNavItem = activeIndex => {
    if (this.state.activeIndex !== activeIndex) {
      this.setState({
        activeIndex,
      });
    }
  };

  onChangeBackground = image => {
    if (image) {
      this.setState({
        backgroundImage: image,
        showImage: true,
      });
    } else {
      this.setState({
        showImage: false,
      });
    }
  };

  render() {
    const { data } = this.props;
    const { activeIndex, isPadSize } = this.state;

    return (
      <div
        ref={s => {
          this.wrapper = s;
        }}
        style={{ width: '100vw', height: '100vh' }}
      >
        <Navbar
          className={activeIndex === 'about' ? 'navbar' : ''}
          hide={isPadSize && activeIndex}
          onActiveNavItem={this.onActiveNavItem}
        >
          <NavItem
            onClick={() => this.onActiveNavItem('project')}
            active={activeIndex === 'project'}
          >
            Project
          </NavItem>
          <NavItem
            onClick={() => this.onActiveNavItem('graphic')}
            active={activeIndex === 'graphic'}
          >
            Graphic
          </NavItem>
          <NavItem
            onClick={() => this.onActiveNavItem('illustration')}
            active={activeIndex === 'illustration'}
          >
            Illustration
          </NavItem>
          <NavItem
            onClick={() => {
              this.onActiveNavItem('about');
            }}
            active={activeIndex === 'about'}
          >
            About
          </NavItem>
        </Navbar>
        <Transition from={{ x: 100 }} enter={{ x: 0 }} native>
          {activeIndex && activeIndex !== 'about'
            ? ({ x }) => (
                <animated.div
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    transform: interpolate(
                      x,
                      x => `translateX(${x}%)`,
                    ),
                  }}
                >
                  <SubMenu isPadSize={isPadSize}>
                    <BackButton
                      onClick={() => {
                        this.setState({ activeIndex: null });
                      }}
                    >
                      Back
                    </BackButton>
                    {data[activeIndex] &&
                      data[activeIndex].edges.map(
                        ({ node: post }) => (
                          <ProjectLi
                            key={post.id}
                            onMouseEnter={() =>
                              this.onChangeBackground(
                                post.frontmatter.heroImage,
                              )
                            }
                            onMouseLeave={() =>
                              this.onChangeBackground()
                            }
                          >
                            <Link
                              to={post.fields.slug}
                              style={{ display: 'flex' }}
                            >
                              <ProjectYear>
                                {post.frontmatter.date}
                              </ProjectYear>
                              <ProjectName>
                                {post.frontmatter.title}
                              </ProjectName>
                            </Link>
                          </ProjectLi>
                        ),
                      )}
                  </SubMenu>
                </animated.div>
              )
            : () => null}
        </Transition>
        <Transition
          from={{ x: 100 }}
          enter={{ x: 0 }}
          leave={{ x: 100 }}
          native
        >
          {activeIndex && activeIndex === 'about'
            ? ({ x }) => (
                <animated.div
                  style={{
                    transform: interpolate(
                      x,
                      x => `translateX(${x}%)`,
                    ),
                  }}
                >
                  <Content>
                    <AboutPageTemplate
                      contentComponent={HTMLContent}
                      title={data.about.frontmatter.title}
                      image={data.about.frontmatter.image}
                      content={data.about.html}
                    />
                  </Content>
                </animated.div>
              )
            : () => null}
        </Transition>
        {this.state.showImage && (
          <BackgroundImageWrapper>
            <img
              src={this.state.backgroundImage}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </BackgroundImageWrapper>
        )}
        {/* <Footer /> */}
      </div>
    );
  }
}

IndexPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
};

export const pageQuery = graphql`
  query IndexQuery {
    project: allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: { frontmatter: { templateKey: { eq: "project" } } }
    ) {
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            title
            templateKey
            date(formatString: "YYYY")
            heroImage
          }
        }
      }
    }
    graphic: allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: { frontmatter: { templateKey: { eq: "graphic" } } }
    ) {
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            title
            templateKey
            date(formatString: "YYYY")
            heroImage
          }
        }
      }
    }
    illustration: allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: { frontmatter: { templateKey: { eq: "illustration" } } }
    ) {
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            title
            templateKey
            date(formatString: "YYYY")
            heroImage
          }
        }
      }
    }
    about: markdownRemark(
      frontmatter: { templateKey: { eq: "about-page" } }
    ) {
      html
      frontmatter {
        image
        title
      }
    }
  }
`;
