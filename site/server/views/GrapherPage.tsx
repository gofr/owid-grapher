import { BAKED_GRAPHER_URL } from "settings"
import * as React from "react"
import urljoin from "url-join"
import * as lodash from "lodash"
import { GrapherInterface } from "grapher/core/GrapherInterface"
import { SiteHeader } from "./SiteHeader"
import { SiteFooter } from "./SiteFooter"
import { Head } from "./Head"
import { Post } from "db/model/Post"
import { RelatedChart } from "site/client/blocks/RelatedCharts/RelatedCharts"
import { ChartListItemVariant } from "./ChartListItemVariant"
import { LoadingIndicator } from "grapher/loadingIndicator/LoadingIndicator"
import { EmbedDetector } from "./EmbedDetector"
import { serializeJSONForHTML } from "utils/serializers"
import { RelatedArticles } from "site/RelatedArticles/RelatedArticles"
import { PostReference } from "adminSite/client/ChartEditor"

export const GrapherPage = (props: {
    grapher: GrapherInterface
    post?: Post.Row
    relatedCharts?: RelatedChart[]
    relatedArticles?: PostReference[]
}) => {
    const { grapher, relatedCharts, relatedArticles } = props
    const pageTitle = grapher.title
    const pageDesc =
        grapher.subtitle ||
        "An interactive visualization from Our World in Data."
    const canonicalUrl = urljoin(BAKED_GRAPHER_URL, grapher.slug as string)
    const imageUrl = urljoin(
        BAKED_GRAPHER_URL,
        "exports",
        `${grapher.slug}.png?v=${grapher.version}`
    )

    const script = `const jsonConfig = ${serializeJSONForHTML(grapher)}
const figure = document.getElementsByTagName("figure")[0];
try {
    const view = window.GrapherView.bootstrap({
        jsonConfig: jsonConfig,
        containerNode: figure,
        queryStr: window.location.search
    });
    view.bindToWindow();
} catch (err) {
    figure.innerHTML = "<img src=\\"/grapher/exports/${
        grapher.slug
    }.svg\\"/><p>Unable to load interactive visualization</p>";
    figure.setAttribute("id", "fallback");
    throw err;
}
`

    const variableIds = lodash.uniq(
        grapher.dimensions!.map((d) => d.variableId)
    )

    return (
        <html>
            <Head
                canonicalUrl={canonicalUrl}
                pageTitle={pageTitle}
                pageDesc={pageDesc}
                imageUrl={imageUrl}
            >
                <meta property="og:image:width" content="850" />
                <meta property="og:image:height" content="600" />
                <EmbedDetector />
                <noscript>
                    <style>{`
                    figure { display: none !important; }
                `}</style>
                </noscript>
                <link
                    rel="preload"
                    href={`/grapher/data/variables/${variableIds.join(
                        "+"
                    )}.json?v=${grapher.version}`}
                    as="fetch"
                    crossOrigin="anonymous"
                />
            </Head>
            <body className="ChartPage">
                <SiteHeader />
                <main>
                    <figure data-grapher-src={`/grapher/${grapher.slug}`}>
                        <LoadingIndicator color="#333" />
                    </figure>
                    <noscript id="fallback">
                        <img
                            src={`${BAKED_GRAPHER_URL}/exports/${grapher.slug}.svg`}
                        />
                        <p>Interactive visualization requires JavaScript</p>
                    </noscript>

                    {((relatedArticles && relatedArticles.length != 0) ||
                        (relatedCharts && relatedCharts.length != 0)) && (
                        <div className="related-research-data">
                            <h2>All our related research and data</h2>
                            {relatedArticles && relatedArticles.length != 0 && (
                                <RelatedArticles articles={relatedArticles} />
                            )}
                            {relatedCharts && relatedCharts.length !== 0 && (
                                <>
                                    <h3>Charts</h3>
                                    <ul>
                                        {relatedCharts
                                            .filter(
                                                (chartItem) =>
                                                    chartItem.slug !==
                                                    grapher.slug
                                            )
                                            .map((c) => (
                                                <ChartListItemVariant
                                                    key={c.slug}
                                                    chart={c}
                                                />
                                            ))}
                                    </ul>
                                </>
                            )}
                        </div>
                    )}
                </main>
                <SiteFooter />
                <script dangerouslySetInnerHTML={{ __html: script }} />
            </body>
        </html>
    )
}
