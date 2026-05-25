import { ConceptEdge } from '@/types'

export const relationships: ConceptEdge[] = [
  { source: 'load-balancing', target: 'caching', label: 'works with' },
  { source: 'load-balancing', target: 'rate-limiting', label: 'enforces' },
  { source: 'load-balancing', target: 'api-gateway', label: 'pairs with' },
  { source: 'load-balancing', target: 'microservices', label: 'routes to' },
  { source: 'caching', target: 'cdn', label: 'extends to edge' },
  { source: 'caching', target: 'db-replication', label: 'reduces load on' },
  { source: 'sharding', target: 'consistent-hashing', label: 'uses' },
  { source: 'sharding', target: 'indexing', label: 'requires' },
  { source: 'sharding', target: 'db-replication', label: 'combined with' },
  { source: 'cap-theorem', target: 'db-replication', label: 'governs' },
  { source: 'cap-theorem', target: 'sharding', label: 'constrains' },
  { source: 'consistent-hashing', target: 'caching', label: 'distributes' },
  { source: 'consistent-hashing', target: 'load-balancing', label: 'enables' },
  { source: 'message-queues', target: 'microservices', label: 'decouples' },
  { source: 'message-queues', target: 'rate-limiting', label: 'buffers for' },
  { source: 'microservices', target: 'api-gateway', label: 'exposed via' },
  { source: 'microservices', target: 'db-replication', label: 'uses' },
  { source: 'api-gateway', target: 'rate-limiting', label: 'implements' },
  { source: 'api-gateway', target: 'caching', label: 'caches at' },
  { source: 'indexing', target: 'db-replication', label: 'replicated with' },

  // Load Balancing → algorithms
  { source: 'load-balancing', target: 'round-robin', label: 'uses algorithm' },
  { source: 'load-balancing', target: 'least-connections', label: 'uses algorithm' },
  { source: 'load-balancing', target: 'ip-hash', label: 'uses algorithm' },
  { source: 'load-balancing', target: 'weighted-round-robin', label: 'uses algorithm' },

  // Load Balancing → layers and implementations
  { source: 'load-balancing', target: 'layer-4', label: 'operates at' },
  { source: 'load-balancing', target: 'layer-7', label: 'operates at' },
  { source: 'load-balancing', target: 'nginx', label: 'implemented by' },
  { source: 'load-balancing', target: 'haproxy', label: 'implemented by' },
  { source: 'load-balancing', target: 'aws-lb', label: 'implemented by' },
  { source: 'load-balancing', target: 'gcp-lb', label: 'implemented by' },

  // Algorithms cross-links
  { source: 'weighted-round-robin', target: 'round-robin', label: 'extends' },
  { source: 'ip-hash', target: 'consistent-hashing', label: 'related to' },

  // NGINX / HAProxy support these algorithms
  { source: 'nginx', target: 'round-robin', label: 'supports' },
  { source: 'nginx', target: 'least-connections', label: 'supports' },
  { source: 'nginx', target: 'ip-hash', label: 'supports' },
  { source: 'nginx', target: 'weighted-round-robin', label: 'supports' },
  { source: 'haproxy', target: 'round-robin', label: 'supports' },
  { source: 'haproxy', target: 'least-connections', label: 'supports' },
  { source: 'haproxy', target: 'ip-hash', label: 'supports' },

  // NGINX as API gateway / reverse proxy
  { source: 'nginx', target: 'api-gateway', label: 'acts as' },
  { source: 'nginx', target: 'rate-limiting', label: 'performs' },
  { source: 'nginx', target: 'caching', label: 'provides' },
  { source: 'nginx', target: 'layer-7', label: 'operates at' },
  { source: 'nginx', target: 'ssl-tls', label: 'terminates' },

  // HAProxy layers
  { source: 'haproxy', target: 'layer-4', label: 'operates at' },
  { source: 'haproxy', target: 'layer-7', label: 'operates at' },

  // AWS LB links
  { source: 'aws-lb', target: 'layer-7', label: 'ALB operates at' },
  { source: 'aws-lb', target: 'layer-4', label: 'NLB operates at' },
  { source: 'aws-lb', target: 'ssl-tls', label: 'terminates via ACM' },
  { source: 'aws-lb', target: 'microservices', label: 'routes to' },
  { source: 'aws-lb', target: 'cdn', label: 'pairs with CloudFront' },

  // GCP LB links
  { source: 'gcp-lb', target: 'layer-4', label: 'TCP/SSL Proxy at' },
  { source: 'gcp-lb', target: 'layer-7', label: 'HTTP(S) LB at' },
  { source: 'gcp-lb', target: 'cdn', label: 'integrates Cloud CDN' },
  { source: 'gcp-lb', target: 'microservices', label: 'routes to' },

  // Layer 4 / Layer 7 cross-links
  { source: 'layer-7', target: 'api-gateway', label: 'enables' },
  { source: 'layer-7', target: 'rate-limiting', label: 'applies at' },
  { source: 'layer-7', target: 'ssl-tls', label: 'terminates' },
  { source: 'layer-4', target: 'layer-7', label: 'sits below' },

  // SSL/TLS links
  { source: 'ssl-tls', target: 'cdn', label: 'secures edge' },
  { source: 'ssl-tls', target: 'api-gateway', label: 'secures' },
]
