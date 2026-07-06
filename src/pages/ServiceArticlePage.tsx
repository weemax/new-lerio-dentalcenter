import { useParams, Link } from 'react-router-dom';
import { Head } from 'vite-react-ssg';
import { articles } from '../data/articles';
import { services } from '../data/content';
import { ArrowLeft, Phone } from 'lucide-react';

const SERVICE_SLUGS = services.map((s) => s.slug);

export function ServiceArticlePage() {
  const { slug } = useParams<{ slug: string }>();

  if (!slug || !SERVICE_SLUGS.includes(slug)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--heading-font-color)' }}>
            Service Not Found
          </h1>
          <p className="text-body mb-8">
            We could not find a service at this URL. Perhaps you'd like to browse our{' '}
            <Link to="/#services" className="underline" style={{ color: 'var(--primary-color)' }}>
              full list of services
            </Link>
            ?
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold"
            style={{ background: 'var(--primary-color)' }}
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const article = articles[slug];
  const service = services.find((s) => s.slug === slug)!;
  const Icon = service.icon;

  // Collect related services that exist in the registry
  const relatedServices = (article?.relatedSlugs ?? [])
    .map((rs) => services.find((s) => s.slug === rs))
    .filter(Boolean) as typeof services;

  return (
    <>
      <Head>
        <title>{article?.title ?? service.title} — Lerio Dental Center</title>
        {article?.metaDescription && (
          <meta name="description" content={article.metaDescription} />
        )}
        <meta
          property="og:title"
          content={`${article?.title ?? service.title} — Lerio Dental Center`}
        />
        {article?.metaDescription && (
          <meta property="og:description" content={article.metaDescription} />
        )}
        {article?.ogImage && <meta property="og:image" content={article.ogImage} />}
        <meta property="og:type" content="article" />
        <link rel="canonical" href={`https://www.leriodentalcenter.com/services/${slug}`} />
        {article?.sections && article.sections.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'MedicalWebPage',
              name: article.title,
              description: article.metaDescription,
              url: `https://www.leriodentalcenter.com/services/${slug}`,
            })}
          </script>
        )}
        {article?.faqs && article.faqs.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: article.faqs.map((faq) => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: faq.answer,
                },
              })),
            })}
          </script>
        )}
      </Head>

      <main className="min-h-screen pt-24 pb-32">
        {/* Back link */}
        <div className="max-w-3xl mx-auto px-6 mb-8">
          <Link
            to="/#services"
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.1em] transition-colors hover:opacity-70"
            style={{ color: 'var(--primary-color)' }}
          >
            <ArrowLeft size={14} />
            All Services
          </Link>
        </div>

        {/* Hero */}
        <div className="max-w-3xl mx-auto px-6 mb-12">
          <div
            className="inline-flex h-16 w-16 items-center justify-center rounded-2xl mb-6"
            style={{
              background: 'linear-gradient(135deg, rgba(74,124,210,0.12) 0%, rgba(234,166,56,0.12) 100%)',
              color: 'var(--primary-color)',
            }}
          >
            <Icon size={28} strokeWidth={1.8} />
          </div>
          <h1 className="text-5xl font-bold mb-4" style={{ color: 'var(--heading-font-color)', fontFamily: 'var(--heading-font-family)' }}>
            {service.title}
          </h1>
          <p className="text-lg leading-relaxed text-body">{service.description}</p>
        </div>

        {/* Content — placeholder when T3 hasn't filled in yet */}
        {article?.sections && article.sections.length > 0 ? (
          <div className="max-w-3xl mx-auto px-6 space-y-12">
            {article.sections.map((section, i) => (
              <section key={i}>
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--heading-font-color)', fontFamily: 'var(--heading-font-family)' }}>
                  {section.heading}
                </h2>
                <div className="space-y-3 text-body leading-relaxed">
                  {section.body.split('\n\n').map((para, j) => (
                    <p key={j}>{para}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="max-w-3xl mx-auto px-6">
            <div
              className="rounded-2xl p-10 text-center border"
              style={{
                background: 'rgba(74,124,210,0.05)',
                borderColor: 'rgba(74,124,210,0.15)',
              }}
            >
              <p className="text-body italic">
                Detailed information about <strong>{service.title}</strong> is being prepared and will be available soon. In the meantime, please{' '}
                <a
                  href="/#contact"
                  className="underline"
                  style={{ color: 'var(--primary-color)' }}
                >
                  contact us
                </a>{' '}
                or call <a href="tel:+639365422515" className="underline" style={{ color: 'var(--primary-color)' }}>0936-542-2515</a> to speak with our team.
              </p>
            </div>
          </div>
        )}

        {/* FAQs */}
        {article?.faqs && article.faqs.length > 0 && (
          <div className="max-w-3xl mx-auto px-6 mt-16">
            <h2 className="text-3xl font-bold mb-8" style={{ color: 'var(--heading-font-color)', fontFamily: 'var(--heading-font-family)' }}>
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {article.faqs.map((faq, i) => (
                <div key={i} className="border-b pb-6" style={{ borderColor: 'rgba(15,28,65,0.08)' }}>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--heading-font-color)' }}>
                    {faq.question}
                  </h3>
                  <p className="text-body leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related services */}
        {relatedServices.length > 0 && (
          <div className="max-w-3xl mx-auto px-6 mt-16">
            <h2 className="text-3xl font-bold mb-8" style={{ color: 'var(--heading-font-color)', fontFamily: 'var(--heading-font-family)' }}>
              Related Services
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedServices.map((svc) => {
                const RelatedIcon = svc.icon;
                return (
                  <Link
                    key={svc.slug}
                    to={`/services/${svc.slug}`}
                    className="card-surface p-6 flex items-center gap-4 hover:scale-[1.02] transition-transform"
                    style={{ textDecoration: 'none' }}
                  >
                    <div
                      className="inline-flex h-12 w-12 items-center justify-center rounded-xl flex-shrink-0"
                      style={{
                        background: 'rgba(74,124,210,0.1)',
                        color: 'var(--primary-color)',
                      }}
                    >
                      <RelatedIcon size={22} strokeWidth={1.8} />
                    </div>
                    <span
                      className="font-semibold text-[15px]"
                      style={{ color: 'var(--heading-font-color)' }}
                    >
                      {svc.title}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* CTA */}
        <div
          className="max-w-3xl mx-auto px-6 mt-20 rounded-2xl p-10 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(74,124,210,0.08) 0%, rgba(234,166,56,0.08) 100%)',
          }}
        >
          <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--heading-font-color)', fontFamily: 'var(--heading-font-family)' }}>
            Ready to Book an Appointment?
          </h2>
          <p className="text-body mb-6">
            Our team at Lerio Dental Center is ready to help with all your dental needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="tel:+639365422515"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-white font-semibold text-[15px]"
              style={{ background: 'var(--primary-color)' }}
            >
              <Phone size={16} />
              Call 0936-542-2515
            </a>
            <a
              href="/#contact"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-[15px] border"
              style={{
                background: 'transparent',
                borderColor: 'var(--primary-color)',
                color: 'var(--primary-color)',
              }}
            >
              Contact Form
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
