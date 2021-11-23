const req = require.context("./icons", false, /\.svg$/);
const requireAll = (requireContext: any) =>
    requireContext.keys().map(requireContext);
requireAll(req);
