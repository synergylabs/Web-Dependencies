import nsProvider from "data/nsProvider.json";

export const getCaGraphStats = (text) => {
  const nodes = [];
  const links = [];
  const allKnownClients = new Set();
  const providerClients = {};
  const clientThirdProviders = {};
  const clientPrivateProviders = new Set();
  const clientUnknownProviders = new Set();
  const clientIndices = {};
  const providerIndices = {};

  const allData = text.split(/\r?\n/).filter((d) => d);
  let index = 0;

  allData.forEach((oneData) => {
    const line = oneData.split(",");
    const client = line[1];
    const providerType = line[4];
    const provider = line[3];

    if (providerType === "Pvt") {
      clientPrivateProviders.add(client);
      allKnownClients.add(client);
    } else if (providerType === "unknown") {
      clientUnknownProviders.add(client);
    } else if (providerType === "Third") {
      allKnownClients.add(client);
      const rank = line[0];

      if (!clientThirdProviders.hasOwnProperty(client)) {
        clientThirdProviders[client] = new Set();
      }
      if (!providerClients.hasOwnProperty(provider)) {
        providerClients[provider] = new Set();
      }

      clientThirdProviders[client].add(provider);

      if (!providerClients[provider].has(client)) {
        providerClients[provider].add(client);

        if (clientIndices.hasOwnProperty(client)) {
          const clientIndex = clientIndices[client];
          nodes[clientIndex]["val"] = nodes[clientIndex]["val"] + 1;
        } else {
          clientIndices[client] = index;
          nodes.push({
            id: index,
            rank: rank,
            label: client,
            nodeType: "Client",
            val: 1,
          });
          index += 1;
        }

        if (providerIndices.hasOwnProperty(provider)) {
          const providerIndex = providerIndices[provider];
          nodes[providerIndex]["val"] = nodes[providerIndex]["val"] + 1;
        } else {
          providerIndices[provider] = index;
          nodes.push({
            id: index,
            label: provider in nsProvider ? nsProvider[provider] : provider,
            nodeType: "Provider",
            val: 1,
            impact: [],
          });
          index += 1;
        }
      }
    }
  });

  // Client centric stats
  let thirdOnlyNum = 0;
  let criticalNum = 0;
  let redundantNum = 0;
  let privateAndThirdNum = 0;

  allKnownClients.forEach((c) => {
    if (!clientUnknownProviders.has(c)) {
      if (clientThirdProviders.hasOwnProperty(c)) {
        if (clientThirdProviders[c].size > 1) {
          redundantNum++;
        }
      }
      if (clientPrivateProviders.has(c) && clientThirdProviders.hasOwnProperty(c)) {
        privateAndThirdNum++;
        redundantNum++;
      } else if (clientThirdProviders.hasOwnProperty(c)) {
        thirdOnlyNum++;

        if (clientThirdProviders[c].size == 1) {
          criticalNum++;
        }
      }
    }
  });

  // Provider centric graph
  const allNodes = [...nodes];
  const topProviders = new Set(
    nodes
      .sort((n1, n2) => n2.val - n1.val)
      .slice(0, 15)
      .map((n) => n.id)
  );
  const nodeToGraph = [];

  for (const p in providerClients) {
    const curClients = providerClients[p];
    const providerIndex = providerIndices[p];
    if (topProviders.has(providerIndex)) {
      nodeToGraph.push(allNodes[providerIndex]);
    }
    curClients.forEach((c) => {
      if (clientThirdProviders[c].size == 1) {
        allNodes[providerIndex]["impact"].push(c);
      }
      if (topProviders.has(providerIndex)) {
        const clientIndex = clientIndices[c];
        nodeToGraph.push(allNodes[clientIndex]);
        links.push({
          source: providerIndex,
          target: clientIndex,
        });
      }
    });
  }

  const graph = {
    nodes: nodeToGraph,
    links: links,
  };

  return [
    graph,
    allNodes,
    allKnownClients.size,
    thirdOnlyNum,
    criticalNum,
    redundantNum,
    privateAndThirdNum,
  ];
};

export const getCdnGraphStats = (text) => {
  const nodes = [];
  const links = [];
  const allKnownClients = new Set();
  const providerClients = {};
  const clientThirdProviders = {};
  const clientPrivateProviders = new Set();
  const clientUnknownProviders = new Set();
  const clientIndices = {};
  const providerIndices = {};

  const allData = text.split(/\r?\n/).filter((d) => d);
  let index = 0;

  allData.forEach((oneData) => {
    const line = oneData.split(",");
    const client = line[1];
    const providerType = line[3];
    const provider = line[2];

    if (providerType === "Pvt") {
      clientPrivateProviders.add(client);
      allKnownClients.add(client);
    } else if (providerType === "unknown") {
      clientUnknownProviders.add(client);
    } else if (providerType === "Third") {
      allKnownClients.add(client);
      const rank = line[0];

      if (!clientThirdProviders.hasOwnProperty(client)) {
        clientThirdProviders[client] = new Set();
      }
      if (!providerClients.hasOwnProperty(provider)) {
        providerClients[provider] = new Set();
      }

      clientThirdProviders[client].add(provider);

      if (!providerClients[provider].has(client)) {
        providerClients[provider].add(client);

        if (clientIndices.hasOwnProperty(client)) {
          const clientIndex = clientIndices[client];
          nodes[clientIndex]["val"] = nodes[clientIndex]["val"] + 1;
        } else {
          clientIndices[client] = index;
          nodes.push({
            id: index,
            rank: rank,
            label: client,
            nodeType: "Client",
            val: 1,
          });
          index += 1;
        }

        if (providerIndices.hasOwnProperty(provider)) {
          const providerIndex = providerIndices[provider];
          nodes[providerIndex]["val"] = nodes[providerIndex]["val"] + 1;
        } else {
          providerIndices[provider] = index;
          nodes.push({
            id: index,
            label: provider in nsProvider ? nsProvider[provider] : provider,
            nodeType: "Provider",
            val: 1,
            impact: [],
          });
          index += 1;
        }
      }
    }
  });

  // Client centric stats
  let thirdOnlyNum = 0;
  let criticalNum = 0;
  let redundantNum = 0;
  let privateAndThirdNum = 0;

  allKnownClients.forEach((c) => {
    if (!clientUnknownProviders.has(c)) {
      if (clientThirdProviders.hasOwnProperty(c)) {
        if (clientThirdProviders[c].size > 1) {
          redundantNum++;
        }
      }
      if (clientPrivateProviders.has(c) && clientThirdProviders.hasOwnProperty(c)) {
        privateAndThirdNum++;
        redundantNum++;
      } else if (clientThirdProviders.hasOwnProperty(c)) {
        thirdOnlyNum++;

        if (clientThirdProviders[c].size == 1) {
          criticalNum++;
        }
      }
    }
  });

  // Provider centric graph
  const allNodes = [...nodes];
  const topProviders = new Set(
    nodes
      .sort((n1, n2) => n2.val - n1.val)
      .slice(0, 15)
      .map((n) => n.id)
  );
  const nodeToGraph = [];

  for (const p in providerClients) {
    const curClients = providerClients[p];
    const providerIndex = providerIndices[p];
    if (topProviders.has(providerIndex)) {
      nodeToGraph.push(allNodes[providerIndex]);
    }
    curClients.forEach((c) => {
      if (clientThirdProviders[c].size == 1) {
        allNodes[providerIndex]["impact"].push(c);
      }
      if (topProviders.has(providerIndex)) {
        const clientIndex = clientIndices[c];
        nodeToGraph.push(allNodes[clientIndex]);
        links.push({
          source: providerIndex,
          target: clientIndex,
        });
      }
    });
  }

  const graph = {
    nodes: nodeToGraph,
    links: links,
  };

  return [
    graph,
    allNodes,
    allKnownClients.size,
    thirdOnlyNum,
    criticalNum,
    redundantNum,
    privateAndThirdNum,
  ];
};

export const getDnsGraphStats = (text) => {
  const nodes = [];
  const links = [];
  const allKnownClients = new Set();
  const providerClients = {};
  const clientThirdProviders = {};
  const clientPrivateProviders = new Set();
  const clientUnknownProviders = new Set();
  const clientIndices = {};
  const providerIndices = {};

  const allData = text.split(/\r?\n/).filter((d) => d);
  let index = 0;

  allData.forEach((oneData) => {
    const line = oneData.split(",");
    const client = line[1];
    const providerType = line[3];
    const provider = line[4];

    if (providerType === "Pvt") {
      clientPrivateProviders.add(client);
      allKnownClients.add(client);
    } else if (providerType === "unknown") {
      clientUnknownProviders.add(client);
    } else if (providerType === "Third") {
      allKnownClients.add(client);
      const rank = line[0];

      if (!clientThirdProviders.hasOwnProperty(client)) {
        clientThirdProviders[client] = new Set();
      }
      if (!providerClients.hasOwnProperty(provider)) {
        providerClients[provider] = new Set();
      }

      clientThirdProviders[client].add(provider);

      if (!providerClients[provider].has(client)) {
        providerClients[provider].add(client);

        if (clientIndices.hasOwnProperty(client)) {
          const clientIndex = clientIndices[client];
          nodes[clientIndex]["val"] = nodes[clientIndex]["val"] + 1;
        } else {
          clientIndices[client] = index;
          nodes.push({
            id: index,
            rank: rank,
            label: client,
            nodeType: "Client",
            val: 1,
          });
          index += 1;
        }

        if (providerIndices.hasOwnProperty(provider)) {
          const providerIndex = providerIndices[provider];
          nodes[providerIndex]["val"] = nodes[providerIndex]["val"] + 1;
        } else {
          providerIndices[provider] = index;
          nodes.push({
            id: index,
            label: provider in nsProvider ? nsProvider[provider] : provider,
            nodeType: "Provider",
            val: 1,
            impact: [],
          });
          index += 1;
        }
      }
    }
  });

  // Client centric stats
  let thirdOnlyNum = 0;
  let criticalNum = 0;
  let redundantNum = 0;
  let privateAndThirdNum = 0;

  allKnownClients.forEach((c) => {
    if (!clientUnknownProviders.has(c)) {
      if (clientThirdProviders.hasOwnProperty(c)) {
        if (clientThirdProviders[c].size > 1) {
          redundantNum++;
        }
      }
      if (clientPrivateProviders.has(c) && clientThirdProviders.hasOwnProperty(c)) {
        privateAndThirdNum++;
        redundantNum++;
      } else if (clientThirdProviders.hasOwnProperty(c)) {
        thirdOnlyNum++;

        if (clientThirdProviders[c].size == 1) {
          criticalNum++;
        }
      }
    }
  });

  // Provider centric graph
  const allNodes = [...nodes];
  const topProviders = new Set(
    nodes
      .sort((n1, n2) => n2.val - n1.val)
      .slice(0, 15)
      .map((n) => n.id)
  );
  const nodeToGraph = [];

  for (const p in providerClients) {
    const curClients = providerClients[p];
    const providerIndex = providerIndices[p];
    if (topProviders.has(providerIndex)) {
      nodeToGraph.push(allNodes[providerIndex]);
    }
    curClients.forEach((c) => {
      if (clientThirdProviders[c].size == 1) {
        allNodes[providerIndex]["impact"].push(c);
      }
      if (topProviders.has(providerIndex)) {
        const clientIndex = clientIndices[c];
        nodeToGraph.push(allNodes[clientIndex]);
        links.push({
          source: providerIndex,
          target: clientIndex,
        });
      }
    });
  }

  const graph = {
    nodes: nodeToGraph,
    links: links,
  };

  return [
    graph,
    allNodes,
    allKnownClients.size,
    thirdOnlyNum,
    criticalNum,
    redundantNum,
    privateAndThirdNum,
  ];
};
