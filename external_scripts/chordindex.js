function compareValue(compare) {
  return function(a, b) {
    return compare(
      a.source.value,
      b.source.value
    );
  };
}

var cos = Math.cos;
var sin = Math.sin;
var pi = Math.PI;
var halfPi = pi / 2;
var tau = pi * 2;
var max = Math.max;
var range = d3.range;

function customeChord() {
  var padAngle = 0,
    sortGroups = null,
    sortSubgroups = null,
    sortChords = null;

  function chord(matrix, points) {
    var n = matrix.length,
      m = matrix[0].length,
      groupSums = [],
      groupIndex = range(n),
      subgroupIndex = [],
      chords = [],
      groups = chords.groups = new Array(n),
      subgroups = new Array(n * m),
      k,
      x,
      x0,
      dx,
      i,
      j;

    // Compute the sum.
    k = 0, i = -1;
    while (++i < n) {
      x = 0, j = -1;
      while (++j < m) {
        x += matrix[i][j];
      }
      groupSums.push(x);
      subgroupIndex.push(range(m));
      k += x;
    }

    // Sort groups…
    if (sortGroups) groupIndex.sort(function(a, b) {
      return sortGroups(groupSums[a], groupSums[b]);
    });

    // Sort subgroups…
    if (sortSubgroups) subgroupIndex.forEach(function(d, i) {
      d.sort(function(a, b) {
        return sortSubgroups(matrix[i][a], matrix[i][b]);
      });
    });

    // Convert the sum to scaling factor for [0, 2pi].
    // TODO Allow start and end angle to be specified?
    // TODO Allow padding to be specified as percentage?
    k = max(0, tau - padAngle * n) / k;
    dx = k ? padAngle : tau / n;

    // Compute the start and end angle for each group and subgroup.
    // Note: Opera has a bug reordering object literal properties!
    x = 0, i = -1;
    while (++i < n) {
      x0 = x, j = -1;
      while (++j < m) {
        var di = groupIndex[i],
          dj = subgroupIndex[di][j],
          v = matrix[di][dj],
          a0 = x,
          a1 = x += v * k;
        subgroups[dj * n + di] = {
          index: di,
          subindex: dj,
          startAngle: a0,
          endAngle: a1,
          value: v
        };
      }
      groups[di] = {
        index: di,
        startAngle: x0,
        endAngle: x,
        value: groupSums[di]
      };
      x += dx;
    }

    // Generate chords for each (non-empty) subgroup-subgroup link.
    i = -1;
    while (++i < n) {
      j = -1;
      while (++j < m) {
        var source = subgroups[j * n + i],
          target = points[j]
        chords.push({
          source: source,
          target: target
        });
      }
    }

    return sortChords ? chords.sort(sortChords) : chords;
    // return chords;
  }

  chord.padAngle = function(_) {
    return arguments.length ? (padAngle = max(0, _), chord) : padAngle;
  };

  chord.sortGroups = function(_) {
    return arguments.length ? (sortGroups = _, chord) : sortGroups;
  };

  chord.sortSubgroups = function(_) {
    return arguments.length ? (sortSubgroups = _, chord) : sortSubgroups;
  };

  chord.sortChords = function(_) {
    return arguments.length ? (_ == null ? sortChords = null : (sortChords = compareValue(_))._ = _, chord) : sortChords && sortChords._;
  };

  return chord;
}