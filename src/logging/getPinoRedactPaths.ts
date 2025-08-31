export const getPinoRedactPaths = (
  ends = [
    'authorization',
    'cookie',
    'set-cookie',
    'password',
    'token',
    'secret',
    'apiKey',
    'clientSecret',
  ],
  reqResParts = ['headers', 'body', 'query'],
) => {

  const symbolsRequiringBracesAccess = ['-'];
  const endsHandled = ends.map(e => symbolsRequiringBracesAccess.some(s => e.includes(s)) ? `["${e}"]` : `.${e}`);
  const reqResStarts = ['req', 'res'].flatMap(s => reqResParts.map(p => `${s}.${p}`));
  const starts = [
    ...reqResStarts,
    '*',
  ];

  return starts.flatMap(s => endsHandled.map(e => `${s}${e}`));
};
