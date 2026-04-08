module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
  "version": 1,
  "endpoints": [
    {
      "path": "/api/intel",
      "description": "IronBridge Intel Oracle -- daily Base ecosystem intelligence",
      "price": "0.002 USDC",
      "network": "base-mainnet",
      "asset": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      "powered_by": "Rachel v2.1, IronBridge agent"
    }
  ],
  "contact": "ironbridge",
  "documentation": "https://ironbridge-jade.vercel.app/api/intel"
});
};
