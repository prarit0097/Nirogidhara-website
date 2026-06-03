import { Pause, Play, RefreshCcw, ShieldCheck } from "lucide-react";
import { automationPaused, getAllPosts, getJobLogs, getSocialPosts } from "../../lib/db";
import { pauseAutomation, publishPost, resumeAutomation, runDailyNow, unpublishPost } from "./actions";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  const posts = getAllPosts(40);
  const logs = getJobLogs(30);
  const social = getSocialPosts(60);
  const paused = automationPaused();
  const published = posts.filter((post) => post.status === "published").length;
  const failedSocial = social.filter((post) => post.status === "failed" || post.status === "skipped").length;

  return (
    <main className="admin-shell">
      <section className="admin-hero">
        <div>
          <p>Nirogidhara operations</p>
          <h1>Publishing and SEO dashboard</h1>
        </div>
        <div className="admin-actions">
          <form action={runDailyNow}>
            <button type="submit">
              <RefreshCcw size={18} /> Generate today
            </button>
          </form>
          <form action={paused ? resumeAutomation : pauseAutomation}>
            <button type="submit">
              {paused ? <Play size={18} /> : <Pause size={18} />}
              {paused ? "Resume" : "Pause"}
            </button>
          </form>
        </div>
      </section>
      <section className="admin-metrics">
        <article>
          <span>Published posts</span>
          <strong>{published}</strong>
        </article>
        <article>
          <span>Automation</span>
          <strong>{paused ? "Paused" : "Active"}</strong>
        </article>
        <article>
          <span>Social attention</span>
          <strong>{failedSocial}</strong>
        </article>
      </section>
      <section className="admin-panel">
        <h2>
          <ShieldCheck size={20} /> Content queue
        </h2>
        <div className="admin-table">
          {posts.map((post) => (
            <article key={post.id}>
              <div>
                <strong>{post.title}</strong>
                <span>
                  {post.locale} · {post.status} · SEO {post.seoScore}/100
                </span>
                <small>{post.safetyNotes}</small>
              </div>
              <div className="row-actions">
                <form action={publishPost}>
                  <input type="hidden" name="id" value={post.id} />
                  <button type="submit">Publish</button>
                </form>
                <form action={unpublishPost}>
                  <input type="hidden" name="id" value={post.id} />
                  <button type="submit">Unpublish</button>
                </form>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="admin-columns">
        <div className="admin-panel">
          <h2>Social status</h2>
          {social.map((item) => (
            <p key={item.id}>
              <strong>{item.channel}</strong> · {item.status} · {item.error ?? "ready"}
            </p>
          ))}
        </div>
        <div className="admin-panel">
          <h2>Job logs</h2>
          {logs.map((log) => (
            <p key={log.id}>
              <strong>{log.status}</strong> · {log.message}
            </p>
          ))}
        </div>
      </section>
    </main>
  );
}
