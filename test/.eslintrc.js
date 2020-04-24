module.exports = {
  "env": {
    "mocha": true
  },
  "rules": {
    "no-unused-vars": [
      "error",
      { "varsIgnorePattern": "should|expect" }
    ],
    "no-unused-expressions": 'off'
  }
}
