'use strict'

const siteConfig = require('./config.js')
const postCssPlugins = require('./postcss-config.js')

module.exports = {
    siteMetadata: {
        // siteUrl: siteConfig.url,
        // url: siteConfig.url,
        siteUrl: 'https://marcopeg.com',
        url: 'https://marcopeg.com',
        title: siteConfig.title,
        subtitle: siteConfig.subtitle,
        copyright: siteConfig.copyright,
        disqusShortname: siteConfig.disqusShortname,
        menu: siteConfig.menu,
        author: siteConfig.author
    },
    plugins: [
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                path: `${__dirname}/content`,
                name: 'pages'
            }
        },
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                path: `${__dirname}/static/media`,
                name: 'media'
            }
        },
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                name: 'assets',
                path: `${__dirname}/static`
            }
        },
        {
            resolve: 'gatsby-plugin-feed',
            options: {
                query: `
                    {
                        site {
                            siteMetadata {
                                site_url: url
                                title
                                description: subtitle
                            }
                        }
                    }
                `,
                feeds: [{
                    serialize: ({ query: { site, allMarkdownRemark } }) => (
                        allMarkdownRemark.edges.map((edge) => Object.assign({}, edge.node.frontmatter, {
                            description: edge.node.frontmatter.description,
                            date: edge.node.frontmatter.date,
                            url: site.siteMetadata.site_url + edge.node.fields.slug,
                            guid: site.siteMetadata.site_url + edge.node.fields.slug,
                            custom_elements: [{ 'content:encoded': edge.node.html }]
                        }))
                    ),
                    query: `
                        {
                            allMarkdownRemark(
                                limit: 1000,
                                sort: { order: DESC, fields: [frontmatter___date] },
                                filter: { frontmatter: { template: { eq: "post" }, draft: { ne: true } } }
                            ) {
                                edges {
                                    node {
                                        html
                                        fields {
                                            slug
                                        }
                                        frontmatter {
                                            title
                                            date
                                            template
                                            draft
                                            description
                                        }
                                    }
                                }
                            }
                        }
                    `,
                    output: '/rss.xml'
                }]
            }
        },
        {
            resolve: 'gatsby-transformer-remark',
            options: {
                plugins: [
                    {
                        resolve: "gatsby-remark-embed-video",
                        options: {
                          width: 450,
                          ratio: 1, // Optional: Defaults to 16/9 = 1.77
                        //   height: 100, // Optional: Overrides optional.ratio
                          related: false, //Optional: Will remove related videos from the end of an embedded YouTube video.
                          noIframeBorder: true, //Optional: Disable insertion of <style> border: 0
                        //   urlOverrides: [
                        //     {
                        //       id: 'youtube',
                        //       embedURL: (videoId) => `https://www.youtube-nocookie.com/embed/${videoId}`,
                        //     }
                        //   ] //Optional: Override URL of a service provider, e.g to enable youtube-nocookie support
                        }
                    },
                    {
                        resolve: 'gatsby-remark-images',
                        options: { maxWidth: 500 }
                    },
                    // {
                    //     resolve: 'gatsby-remark-responsive-iframe',
                    //     options: { wrapperStyle: 'margin-bottom: 1.0725rem' }
                    // },
                    'gatsby-remark-autolink-headers',
                    'gatsby-remark-prismjs',
                    'gatsby-remark-copy-linked-files',
                    'gatsby-remark-smartypants',
                    // 'gatsby-remark-responsive-iframe',
                ],
            }
        },
        'gatsby-transformer-sharp',
        'gatsby-plugin-sharp',
        'gatsby-plugin-netlify',
        {
            resolve: 'gatsby-plugin-netlify-cms',
            options: {
                modulePath: `${__dirname}/src/cms/cms.js`,
            }
        },
        {
            resolve: 'gatsby-plugin-google-analytics',
            options: { trackingId: siteConfig.googleAnalyticsId }
        },
        'gatsby-plugin-sitemap',
        {
            resolve: 'gatsby-plugin-manifest',
            options: {
                name: siteConfig.title,
                short_name: siteConfig.title,
                start_url: '/',
                background_color: '#FFF',
                theme_color: '#F7A046',
                display: 'standalone',
                icon: 'static/marcopeg.jpg'
            },
        },
        'gatsby-plugin-offline',
        'gatsby-plugin-catch-links',
        'gatsby-plugin-react-helmet',
        {
            resolve: 'gatsby-plugin-sass',
            options: {
                postCssPlugins: [...postCssPlugins],
                cssLoaderOptions: {
                    camelCase: false,
                }
            }
        },
        {
            resolve: 'gatsby-plugin-typography',
            options: {
                pathToConfigModule: 'src/utils/typography',
            },
        },
    ]
}
