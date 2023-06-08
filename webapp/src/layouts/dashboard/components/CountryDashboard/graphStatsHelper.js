import nsProvider from "data/nsProvider.json";

export const getCaGraphStats = (text) => {
  const nodes = [];
  const links = [];
  const allKnownClients = new Set();
  const providerClients = {};
  const clientThirdProviders = {};
  const clientPrivateProviders = new Set();
  const clientUnknownProviders = new Set();
  const staplingEnabledClients = new Set();
  const clientIndices = {};
  const providerIndices = {};
  const allData = text.split(/\r?\n/).filter((d) => d);
  let index = 0;

  allData.forEach((oneData) => {
    const line = oneData.split(",");
    console.log(line);
    const client = [line[0], line[1]];
    const providerType = line[3];
    const provider = line[2];
    const rank = line[0];
    const stapling = line[4];
    if (providerType === "Pvt") {
      clientPrivateProviders.add(client[1]);
      allKnownClients.add(client[1]);
    } else if (providerType === "unknown") {
      clientUnknownProviders.add(client[1]);
    } else if (providerType === "Third") {
      allKnownClients.add(client[1]);

      if (!clientThirdProviders.hasOwnProperty(client[1])) {
        clientThirdProviders[client[1]] = new Set();
      }

      clientThirdProviders[client[1]].add(provider);
    }
    if (stapling == "True") {
      staplingEnabledClients.add(client[1]);
    }
    if (!providerClients.hasOwnProperty(provider)) {
      providerClients[provider] = new Set();
    }
    if (!providerClients[provider].has(client[1])) {
      providerClients[provider].add(client[1]);

      if (clientIndices.hasOwnProperty(client[1])) {
        const clientIndex = clientIndices[client[1]];
        nodes[clientIndex][providerType].add(provider);
      } else {
        clientIndices[client[1]] = index;
        nodes.push({
          id: index,
          rank: rank,
          label: client[1],
          nodeType: "Client",
          val: 1,
          Pvt: new Set(),
          Third: new Set(),
          unknown: new Set(),
          stapling: stapling,
        });
        nodes[index][providerType].add(provider);
        index += 1;
      }

      if (providerIndices.hasOwnProperty(provider)) {
        const providerIndex = providerIndices[provider];
        nodes[providerIndex]["conc"].add(client[1]);
        if (stapling == "False") {
          nodes[providerIndex]["impact"].add(client[1]);
        }
      } else {
        providerIndices[provider] = index;
        nodes.push({
          id: index,
          label: provider, //in nsProvider ? nsProvider[provider] : provider,
          nodeType: "Provider",
          conc: new Set(),
          impact: new Set(),
          type: providerType,
        });
        nodes[index]["conc"].add(client[1]);
        if (stapling == "False") {
          nodes[index]["impact"].add(client[1]);
        }
        index += 1;
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
        if (staplingEnabledClients.has(c)) {
          redundantNum++;
        }
      }
      if (clientThirdProviders.hasOwnProperty(c)) {
        thirdOnlyNum++;

        if (!staplingEnabledClients.has(c)) {
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
      .slice(0, 50)
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
      // if (clientThirdProviders.hasOwnProperty(c) && clientThirdProviders[c].size == 1) {
      //   allNodes[providerIndex]["impact"].add(c);
      // }
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
  const dns_hard_copy = {};
  dns_hard_copy["turbobytes"] = ["nsone.net"];
  dns_hard_copy["akamai"] = ["akam.net"];
  dns_hard_copy["akamaichina"] = ["tl88.net"];
  dns_hard_copy["alibaba"] = ["taobao.com"];
  dns_hard_copy["cloudfront"] = ["amazon.com"];
  dns_hard_copy["ananke"] = ["ananke.com.br"];
  dns_hard_copy["at&t"] = ["att.com"];
  dns_hard_copy["azion"] = ["azioncdn.net"];
  dns_hard_copy["azion"] = ["amazon.com"];
  dns_hard_copy["belugacdn"] = ["belugacdn.com"];
  dns_hard_copy["edgecast"] = ["edgecastdns"];
  dns_hard_copy["cachefly"] = ["cachefly.net"];
  dns_hard_copy["cdn77"] = ["cdn77.net"];
  dns_hard_copy["cdnetworks"] = ["panthercdn.com"];
  dns_hard_copy["cdnify"] = ["cdnify.io"];
  dns_hard_copy["chinacache"] = ["alibabadns.com"];
  dns_hard_copy["chinanetcenter"] = ["chinanetcenter"];
  dns_hard_copy["cloudflare"] = ["cloudflare"];
  dns_hard_copy["fastly"] = ["fastly.net", "dynect.net"];
  dns_hard_copy["google"] = ["google.com"];
  dns_hard_copy["hibernia"] = ["gtt.net"];
  dns_hard_copy["incapsula"] = ["incapdns.net"];
  dns_hard_copy["instartLogic"] = ["insnw.net"];
  dns_hard_copy["internap"] = ["internapcdn.net"];
  dns_hard_copy["keycdn"] = ["amazon.com"];
  dns_hard_copy["leasewebcdn"] = ["lswcdn.com"];
  dns_hard_copy["level3"] = ["footprint.net"];
  dns_hard_copy["limeLight"] = ["llwdns"];
  dns_hard_copy["maxcdn"] = ["amazon.com", "nsone.net"];
  dns_hard_copy["stackpath"] = ["nsone.net", "amazon.com", "hwcdn.net"];
  // dns_hard_copy["Medianova"] = ["mncdn.com"];
  // dns_hard_copy["MirrorImage"] = ["domaincontrol.com"];
  dns_hard_copy["reflectedretworks"] = ["footprint.net", "reflected.net"];
  dns_hard_copy["SimpleCDN"] = ["dnshound.sx"];
  dns_hard_copy["SwiftCDN"] = ["footprint.net"];
  dns_hard_copy["swiftserve"] = ["dnsmadeeasy.com"];
  dns_hard_copy["tata"] = ["bitgravity.com"];
  dns_hard_copy["telefonica"] = ["telefonica-data.com", "amazon.com"];
  dns_hard_copy["azure"] = ["azure-dns"];
  dns_hard_copy["yahoo"] = ["yahoo.com"];
  dns_hard_copy["zenedge"] = ["amazon.com"];
  dns_hard_copy["bunnycdn"] = ["bunnydns.com"];
  dns_hard_copy["kingsoft"] = ["ksyuncdn.com"];
  dns_hard_copy["tencent"] = ["qq.com"];
  dns_hard_copy["tencent"] = ["ovscdns.com"];
  dns_hard_copy["pantheon"] = ["amazon.com"];
  dns_hard_copy["onapp"] = ["worldcdn.net"];
  dns_hard_copy["sitelockcdn"] = ["dnsmadeeasy.com"];
  dns_hard_copy["aryakasmartcdn"] = ["aads1.net"];
  dns_hard_copy["StreamShark"] = ["nsone.net"];
  dns_hard_copy["StreamShark"] = ["amazon.com"];
  dns_hard_copy["IBMCloud"] = ["ibm.com"];
  dns_hard_copy["Uploadcare"] = ["akam.net"];
  dns_hard_copy["Sirv"] = ["amazon.com"];
  dns_hard_copy["g-core"] = ["gcdn.co"];
  dns_hard_copy["DDoS-GUARD"] = ["ddos-guard.net"];
  dns_hard_copy["BootstrapCDN"] = ["amazon.com"];
  dns_hard_copy["BootstrapCDN"] = ["cloudflare"];
  dns_hard_copy["CDNjs"] = ["cloudflare"];
  dns_hard_copy["Cloudinary"] = ["amazon.com"];
  dns_hard_copy["jsDelivr"] = ["cloudns.net"];
  dns_hard_copy["jsDelivr"] = ["nsone.net"];
  dns_hard_copy["jsDelivr"] = ["cloudflare"];
  dns_hard_copy["PhotonJetpack"] = ["wordpress.com"];
  dns_hard_copy["Rackspace"] = ["rackspace.com"];
  dns_hard_copy["Rackspace"] = ["stabletransit.com"];
  dns_hard_copy["CDNsun"] = ["cdnsun.net"];
  dns_hard_copy["TinyCDN"] = ["amazon.com"];
  dns_hard_copy["AmazonWebServices"] = ["amazonaws.com"];
  dns_hard_copy["MegaFon"] = ["misp.ru"];
  dns_hard_copy["SoftLayer"] = ["softlayer.net"];
  dns_hard_copy["OVH"] = ["ovh.net"];
  dns_hard_copy["CDNvideo"] = ["cdnvideo.ru"];
  dns_hard_copy["Staticfile"] = ["dnspod.net"];
  dns_hard_copy["BootcssCDN"] = ["hichina.com"];
  dns_hard_copy["Upai"] = ["ialloc.com"];
  dns_hard_copy["Baidu"] = ["baidu.com"];
  dns_hard_copy["jqueryCDN"] = ["cloudflare"];
  dns_hard_copy["DistilNetworks"] = ["nsone.net"];
  dns_hard_copy["DistilNetworks"] = ["dynect.net"];
  dns_hard_copy["KPN"] = ["kpn.net"];
  dns_hard_copy["NTT"] = ["ocn.ad.jp"];
  dns_hard_copy["Telenor"] = ["amazon.com"];
  dns_hard_copy["Telenor"] = ["telenor.se"];
  dns_hard_copy["Telenor"] = ["dynect.net"];
  dns_hard_copy["PageCDN"] = ["digitalocean.com"];
  dns_hard_copy["PageCDN"] = ["amazon.com"];
  dns_hard_copy["UNPKG"] = ["cloudflare"];
  dns_hard_copy["ArvanCloud"] = ["arvancdn.com"];
  dns_hard_copy["MetaCDN"] = ["nsone.net"];
  dns_hard_copy["MetaCDN"] = ["amazon.com"];
  dns_hard_copy["SevenNiuyunCDN"] = ["dnsv5.com"];
  dns_hard_copy["VeryCloud"] = ["veryns.com"];
  dns_hard_copy["360CDN"] = ["360safe.com"];
  dns_hard_copy["YahooJapan"] = ["yahoo.co.jp"];
  dns_hard_copy["BaishanCloud"] = ["qingcdn.com"];
  dns_hard_copy["Dilian"] = ["fastcdn.com"];
  dns_hard_copy["AnotherCloud"] = ["ialloc.com"];
  dns_hard_copy["Cloud-Intelligence"] = ["spdydns.com"];
  dns_hard_copy["NeteaseCloud"] = ["netease"];
  dns_hard_copy["RapLeaf"] = ["amazon.com"];
  dns_hard_copy["VoxCDN"] = ["voxel.net"];
  dns_hard_copy["Yottaa"] = ["yottaa.net"];
  dns_hard_copy["CubeCDN"] = ["cubecdn.net"];
  dns_hard_copy["SFRCDN"] = ["sfr.net"];
  dns_hard_copy["MediaCloud"] = ["cdncloud.net.au"];
  dns_hard_copy["NYIFTW"] = ["nyidns.net"];
  dns_hard_copy["ReSRC.it"] = ["ultradns.com"];
  dns_hard_copy["ReSRC.it"] = ["nsone.net"];
  dns_hard_copy["ReSRC.it"] = ["dynect.net"];
  dns_hard_copy["RevSoftware"] = ["cloudflare"];
  dns_hard_copy["Caspowa"] = ["amazon.com"];
  dns_hard_copy["Twitter"] = ["twtrdns.net"];
  dns_hard_copy["Twitter"] = ["dynect.net"];
  dns_hard_copy["Facebook"] = ["facebook.com"];
  dns_hard_copy["Section.io"] = ["nsone.net"];
  dns_hard_copy["BisonGrid"] = ["bisongrid.com"];
  dns_hard_copy["GoCache"] = ["gocache.com.br"];
  dns_hard_copy["unicornCDN"] = ["amazon.com"];
  dns_hard_copy["OptimalCDN"] = ["optimalcdn.com"];
  dns_hard_copy["KINXCDN"] = ["kinx.net"];
  dns_hard_copy["KINXCDN"] = ["amazon.com"];
  dns_hard_copy["hosting4cdn"] = ["hosting4real.net"];
  dns_hard_copy["Netlify"] = ["nsone.net"];
  dns_hard_copy["Netlify"] = ["netlifydns.com"];

  const allKnownClients = new Set();
  const providerClients = {};
  const clientThirdProviders = {};
  const clientPrivateProviders = {};
  const clientUnknownProviders = new Set();
  const clientIndices = {};
  const providerIndices = {};

  const allData = text.split(/\r?\n/).filter((d) => d);
  let index = 0;

  allData.forEach((oneData) => {
    const line = oneData.split(",");
    const client = [line[0], line[1]];
    const providerType = line[3];
    const provider = line[2];
    const rank = line[0];
    if (providerType === "Pvt") {
      clientPrivateProviders[client[1]] = provider;
      allKnownClients.add(client[1]);
    } else if (providerType === "unknown") {
      clientUnknownProviders.add(client[1]);
    } else if (providerType === "Third") {
      allKnownClients.add(client[1]);

      if (!clientThirdProviders.hasOwnProperty(client[1])) {
        clientThirdProviders[client[1]] = new Set();
      }

      clientThirdProviders[client[1]].add(provider);
    }
    if (!providerClients.hasOwnProperty(provider)) {
      providerClients[provider] = new Set();
    }
    if (!providerClients[provider].has(client[1])) {
      providerClients[provider].add(client[1]);

      if (clientIndices.hasOwnProperty(client[1])) {
        const clientIndex = clientIndices[client[1]];
        nodes[clientIndex][providerType].add(provider);
      } else {
        clientIndices[client[1]] = index;
        nodes.push({
          id: index,
          rank: rank,
          label: client[1],
          nodeType: "Client",
          val: 1,
          Pvt: new Set(),
          Third: new Set(),
          unknown: new Set(),
        });
        nodes[index][providerType].add(provider);
        index += 1;
      }
      if (providerIndices.hasOwnProperty(provider)) {
        const providerIndex = providerIndices[provider];
        nodes[providerIndex]["conc"].add(client[1]);
      } else {
        providerIndices[provider] = index;
        nodes.push({
          id: index,
          label: provider,
          nodeType: "Provider",
          conc: new Set(),
          impact: new Set(),
          type: providerType,
          dns: dns_hard_copy.hasOwnProperty(provider) ? dns_hard_copy[provider] : ["ultradns"],
        });
        // console.log(nodes[index].dns, dns_hard_copy[provider]);
        nodes[index]["conc"].add(client[1]);
        index += 1;
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
      if (clientPrivateProviders.hasOwnProperty(c) && clientThirdProviders.hasOwnProperty(c)) {
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
      .slice(0, 50)
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
      if (clientThirdProviders.hasOwnProperty(c) && clientThirdProviders[c].size == 1) {
        allNodes[providerIndex]["impact"].add(c);
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
  const clientPrivateProviders = {};
  const clientUnknownProviders = new Set();
  const clientIndices = {};
  const providerIndices = {};

  const allData = text.split(/\r?\n/).filter((d) => d);
  let index = 0;

  allData.forEach((oneData) => {
    const line = oneData.split(",");
    const client = [line[0], line[1]];
    const providerType = line[3];
    const provider = line[2];
    const rank = line[0];
    if (providerType === "Pvt") {
      clientPrivateProviders[client[1]] = provider;
      allKnownClients.add(client[1]);
    } else if (providerType === "unknown") {
      clientUnknownProviders.add(client[1]);
    } else if (providerType === "Third") {
      allKnownClients.add(client[1]);
      if (!clientThirdProviders.hasOwnProperty(client[1])) {
        clientThirdProviders[client[1]] = new Set();
      }
      clientThirdProviders[client[1]].add(provider);
    }

    if (!providerClients.hasOwnProperty(provider)) {
      providerClients[provider] = new Set();
    }

    providerClients[provider].add(client[1]);

    if (clientIndices.hasOwnProperty(client[1])) {
      const clientIndex = clientIndices[client[1]];
      nodes[clientIndex][providerType].add(provider);
    } else {
      clientIndices[client[1]] = index;
      nodes.push({
        id: index,
        rank: rank,
        label: client[1],
        nodeType: "Client",
        val: 1,
        Pvt: new Set(),
        Third: new Set(),
        unknown: new Set(),
      });
      nodes[index][providerType].add(provider);
      index += 1;
    }

    if (providerIndices.hasOwnProperty(provider)) {
      const providerIndex = providerIndices[provider];
      nodes[providerIndex]["conc"].add(client[1]);
    } else {
      providerIndices[provider] = index;
      nodes.push({
        id: index,
        label: provider, // in nsProvider ? nsProvider[provider] : provider,
        nodeType: "Provider",
        conc: new Set(),
        impact: new Set(),
        type: providerType,
      });
      nodes[index]["conc"].add(client[1]);
      index += 1;
    }
  });

  // Client centric stats
  let thirdOnlyNum = 0;
  let criticalNum = 0;
  let redundantNum = 0;
  let privateAndThirdNum = 0;
  let privateAndThird = {};

  allKnownClients.forEach((c) => {
    if (!clientUnknownProviders.has(c)) {
      if (clientThirdProviders.hasOwnProperty(c)) {
        if (clientThirdProviders[c].size > 1) {
          redundantNum++;
        }
      }
      if (clientPrivateProviders.hasOwnProperty(c) && clientThirdProviders.hasOwnProperty(c)) {
        privateAndThirdNum++;
        if (!privateAndThird.hasOwnProperty(c)) {
          privateAndThird[c] = new Set();
        }
        privateAndThird[c].add(clientPrivateProviders[c]);
        privateAndThird[c].add(clientThirdProviders[c]);
        redundantNum++;
      }
      if (
        clientThirdProviders.hasOwnProperty(c) &&
        clientThirdProviders[c].size > 1 && 
        !clientPrivateProviders.hasOwnProperty(c)
      ) {
        thirdOnlyNum++;
      }

      if (clientThirdProviders.hasOwnProperty(c) && clientThirdProviders[c].size == 1 && 
          !clientPrivateProviders.hasOwnProperty(c)) {
          criticalNum++;
      }
    }
  });

  // Provider centric graph
  const allNodes = [...nodes];
  const topProviders = new Set(
    nodes
      .sort((n1, n2) => n2.val - n1.val)
      .slice(0, 50)
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
      if (clientThirdProviders.hasOwnProperty(c) && clientThirdProviders[c].size == 1) {
        allNodes[providerIndex]["impact"].add(c[1]);
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
    privateAndThird,
  ];
};
