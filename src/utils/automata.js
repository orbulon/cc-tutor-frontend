import vis from 'vis';

const automata = {};
const config = {
  FINAL_STATE_COLOR: '#f00'
}

automata.EPSILON = 'ε';

automata.createEmpty = (container, options = {}) => {
  const nodes = new vis.DataSet();
  const edges = new vis.DataSet();

  return {
    instance: new vis.Network(document.getElementById(container), { nodes, edges }, options),
    nodes,
    edges
  };
};

automata.visDataFormat = data => {
  let nodesData = new Set();

  data.forEach(e => {
    nodesData.add(JSON.stringify(e.src));
    nodesData.add(JSON.stringify(e.dest));
  });

  let nodes = new vis.DataSet([...nodesData].map(node => {
    const n = JSON.parse(node);
    return {
      id: n.id,
      label: '' + n.id,
      color: {background: n.final ? config.FINAL_STATE_COLOR : null}
    }
  }));

  let edgesData = [];

  data.forEach(e => {
    edgesData.push({
      from: e.src.id,
      to: e.dest.id,
      arrows:'to',
      label: e.char,
      font: {align: 'top'}
    });
  });

  let edges = new vis.DataSet(edgesData);

  return { nodes, edges };
};

automata.fromVis = edges => {
  let nfa = [];

  edges.forEach(e => {
    nfa.push({
      src: {
        id: e.from,
        final: false
      },
      char: e.label,
      dest: {
        id: e.to,
        final: false
      }
    });
  });

  return nfa;
};

automata.addNode = (fa, n) => {
  if (n === undefined) {
    n = {
      id: n,
      final: false
    };
  }

  fa.nodes.add({
    id: n.id,
    label: '' + n.id,
    color: {background: n.final ? config.FINAL_STATE_COLOR : null}
  });
};

automata.addEdge = (fa, n1, n2, transition) => {
  if (n1.id === undefined) {
    n1 = {
      id: n1,
      final: false
    };
  }

  if (n2.id === undefined) {
    n2 = {
      id: n2,
      final: false
    };
  }

  let n1o = fa.nodes.get(n1.id);
  let n2o = fa.nodes.get(n2.id);

  if (n1o === null) {
    fa.nodes.add({
      id: n1.id,
      label: '' + n1.id,
      color: {background: n1.final ? config.FINAL_STATE_COLOR : null}
    });
  }

  if (n2o === null) {
    fa.nodes.add({
      id: n2.id,
      label: '' + n2.id,
      color: {background: n2.final ? config.FINAL_STATE_COLOR : null}
    });
  }

  fa.edges.add({
    from: n1.id,
    to: n2.id,
    arrows: 'to',
    label: transition,
    font: {align: 'top'}
  });
};

automata.highlightNodes = (fa, nodes, color = '#f00') => {
  fa.nodes.update(nodes.map(n => ({id: n, color: {background: color}})));
}

automata.resetNodesHighlight = fa => {

}

automata.highlightEdges = (fa, edges, color = '#f00') => {
  fa.edges.update(edges.map(e => ({ char: e.char, color: { color } })));
}

automata.resetEdgesHighlight = fa => {

}

export default automata;
