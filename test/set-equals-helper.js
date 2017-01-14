module.exports = setEquals

/**
 * Check two sets for equivalence.
 *
 * @param {Object} t - The `t` thing from a tape test case
 * @param {Set} actual
 * @param {Set} expected
 */
function setEquals(t, actual, expected) {
  t.deepEquals([...actual].sort(), [...expected].sort());
};
