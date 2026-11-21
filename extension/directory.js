// Fictional partner record bundled for the prototype. Matching always uses exact hosts.
const demoOperator = {
  name: "Pearl Mobile",
  billing: "billing.pearl.localhost",
  providers: ["billing.pearl.localhost", "processor.pearl.localhost"]
};

function decide(topHost, reports) {
  const sensitive = reports.filter(report => report.kind);
  if (!sensitive.length) return null;
  const claimed = reports.some(report => report.claimed);
  const unlisted = host => !demoOperator.providers.includes(host);
  const mismatch = claimed && (unlisted(topHost) || sensitive.some(report => unlisted(report.host)));
  const listed = !unlisted(topHost) && sensitive.every(report => !unlisted(report.host));
  const kind = sensitive.some(report => report.kind === "code") ? "code" : "payment";
  const destination = (sensitive.find(report => unlisted(report.host)) || sensitive[0]).host;
  return { kind, destination, status: mismatch ? "mismatch" : listed ? "listed" : "unknown" };
}
