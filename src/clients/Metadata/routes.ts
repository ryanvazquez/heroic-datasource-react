const ROUTES = {
  "parse-filter": {
    url: "/parser/parse-filter",
    method: "POST",
    headers: {
      'Content-Type': 'text/plain;charset=UTF-8'
    }
  },
  "key-suggest": {
    url: "/metadata/key-suggest",
    method: "POST",
  },
  "tag-suggest": {
    url: "/metadata/tag-suggest",
    method: "POST",
  },
  "tagkey-count": {
    url: "/metadata/tagkey-count",
    method: "POST",
  },
};

export default ROUTES;