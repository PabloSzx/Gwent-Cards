const self_destruct = "\n\n\n`This message will self-destruct in 10 seconds`";
const self_destruct_30 =
  "\n\n\n`This message will self-destruct in 30 seconds`";
const keg = {
  requests: [{ path: "streams.getAll" }, { path: "cards.getKeg" }],
};

export { self_destruct, self_destruct_30 };
