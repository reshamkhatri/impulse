'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/content';
import { cloudinaryImage } from '@/lib/cloudinary';

export default function BlogListing({ posts = [], head = {} }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Collect unique categories
  const categories = useMemo(() => {
    const set = new Set(posts.map((p) => p.category).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [posts]);

  // Filter posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCat = selectedCategory === 'All' || post.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  const [lead, ...rest] = filteredPosts;

  return (
    <div className="blog-container">
      {/* Header Banner */}
      <header className="blog-head">
        <h1 className="blog-headline" id="blog-heading">{head.heading || 'Blogs & Articles'}</h1>

        {/* Filter bar & search */}
        <div className="blog-toolbar">
          <div className="blog-filters" role="tablist" aria-label="Article categories">
            {categories.map((cat) => {
              const count = cat === 'All' ? posts.length : posts.filter((p) => p.category === cat).length;
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={isActive}
                  className={`blog-filter-pill ${isActive ? 'is-active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  <span>{cat}</span>
                  <span className="blog-filter-count">{count}</span>
                </button>
              );
            })}
          </div>

          <div className="blog-search-wrap">
            <svg className="blog-search-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="search"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="blog-search-input"
              aria-label="Search articles"
            />
            {searchQuery && (
              <button
                type="button"
                className="blog-search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                &times;
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Empty State */}
      {filteredPosts.length === 0 ? (
        <div className="blog-empty">
          <span className="blog-empty-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4.5h11a2.5 2.5 0 0 1 2.5 2.5v13H6.5A2.5 2.5 0 0 1 4 17.5z" />
              <path d="M17.5 8.5H20v9a2.5 2.5 0 0 1-2.5 2.5" />
              <path d="M7.5 9h6M7.5 13h4" />
            </svg>
          </span>
          <h2 className="blog-empty-title">No articles match your criteria</h2>
          <p className="blog-empty-text">
            Try adjusting your search query or selecting a different category tab.
          </p>
          <button
            type="button"
            className="btn-pill-white"
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
          >
            Reset filters
          </button>
        </div>
      ) : (
        <>
          {/* Featured Hero Card (Lead Story) */}
          {lead && (
            <section className="blog-featured-section" aria-label="Featured article">
              <div className="blog-section-label">
                <span className="blog-pulse-dot" aria-hidden="true" />
                Featured Story
              </div>

              <Link href={`/blog/${lead.slug}`} className="blog-hero-card">
                <div className="blog-hero-media">
                  <img
                    src={cloudinaryImage(lead.coverImage || '/blog/bootcamp.webp', { width: 900, height: 600, crop: 'fill' })}
                    alt={lead.title}
                    loading="eager"
                    decoding="async"
                    className="blog-hero-img"
                  />
                  <span className="blog-hero-badge">{lead.category}</span>
                </div>

                <div className="blog-hero-content">
                  <div className="blog-hero-meta">
                    <span className="blog-tag">{lead.category}</span>
                    <span className="blog-dot" aria-hidden="true" />
                    <time dateTime={lead.date}>{formatDate(lead.date)}</time>
                    <span className="blog-dot" aria-hidden="true" />
                    <span className="blog-read-badge">{lead.readTime}</span>
                  </div>

                  <h2 className="blog-hero-title">{lead.title}</h2>
                  <p className="blog-hero-excerpt">{lead.excerpt}</p>

                  <div className="blog-hero-footer">
                    <div className="blog-author-chip">
                      <img
                        src="/avatar_one.jpg"
                        alt={lead.author}
                        className="blog-author-avatar"
                        width="36"
                        height="36"
                      />
                      <div className="blog-author-text">
                        <span className="blog-author-name">{lead.author}</span>
                        <span className="blog-author-caption">Consulting Specialist</span>
                      </div>
                    </div>

                    <span className="blog-hero-cta">
                      Read Full Article
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </section>
          )}

          {/* Grid of Remaining Articles */}
          {rest.length > 0 && (
            <section className="blog-grid-section" aria-label="More articles">
              <div className="blog-grid-header">
                <h2 className="blog-grid-heading">Latest Publications</h2>
                <span className="blog-grid-count">{rest.length} {rest.length === 1 ? 'article' : 'articles'}</span>
              </div>

              <div className="blog-grid">
                {rest.map((post) => (
                  <Link href={`/blog/${post.slug}`} className="blog-card" key={post.slug}>
                    <div className="blog-card-media">
                      <img
                        src={cloudinaryImage(post.coverImage || '/blog/training-session.jpg', { width: 640, height: 420, crop: 'fill' })}
                        alt={post.title}
                        loading="lazy"
                        decoding="async"
                        className="blog-card-img"
                      />
                      <span className="blog-card-badge">{post.category}</span>
                    </div>

                    <div className="blog-card-content">
                      <div className="blog-card-meta">
                        <time dateTime={post.date}>{formatDate(post.date)}</time>
                        <span className="blog-dot" aria-hidden="true" />
                        <span>{post.readTime}</span>
                      </div>

                      <h3 className="blog-card-title">{post.title}</h3>
                      <p className="blog-card-excerpt">{post.excerpt}</p>

                      <div className="blog-card-foot">
                        <div className="blog-card-author-mini">
                          <img
                            src="/avatar_two.jpg"
                            alt={post.author}
                            className="blog-mini-avatar"
                            width="24"
                            height="24"
                          />
                          <span>{post.author}</span>
                        </div>

                        <span className="blog-more">
                          Read
                          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M5 12h13" /><path d="m12 5 7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
