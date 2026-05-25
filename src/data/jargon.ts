import { JargonTerm, JargonBadge } from '@/types'

export const jargonTerms: JargonTerm[] = [
  // ═══════════════ LOAD BALANCING ═══════════════
  { id: 'round-robin-algo', term: 'Round Robin', definition: 'Distributes requests sequentially to each server in turn, cycling back to the first after reaching the last.', conceptId: 'load-balancing', badgeGroup: 'balance-master' },
  { id: 'least-connections-algo', term: 'Least Connections', definition: 'Routes each new request to the server currently handling the fewest active connections.', conceptId: 'load-balancing', badgeGroup: 'balance-master' },
  { id: 'ip-hash-algo', term: 'IP Hash', definition: 'Hashes the client IP to deterministically route all their requests to the same backend server.', conceptId: 'load-balancing', badgeGroup: 'balance-master' },
  { id: 'weighted-rr-algo', term: 'Weighted Round Robin', definition: 'Like Round Robin but servers with higher weights get proportionally more requests.', conceptId: 'load-balancing', badgeGroup: 'balance-master' },
  { id: 'health-checks', term: 'Health Checks', definition: 'Periodic probes sent to backend servers to verify they are alive and ready to handle traffic.', conceptId: 'load-balancing', badgeGroup: 'balance-master' },
  { id: 'sticky-sessions', term: 'Sticky Sessions', definition: 'Ensuring all requests from the same client go to the same server, usually via cookies or IP affinity.', conceptId: 'load-balancing', badgeGroup: 'balance-master' },
  { id: 'active-passive', term: 'Active-Passive', definition: 'A redundancy pattern where one node handles traffic while a standby waits to take over on failure.', conceptId: 'load-balancing', badgeGroup: 'balance-master' },
  { id: 'active-active', term: 'Active-Active', definition: 'A redundancy pattern where all nodes handle traffic simultaneously, sharing the load.', conceptId: 'load-balancing', badgeGroup: 'balance-master' },

  // ═══════════════ LAYER 4 ═══════════════
  { id: 'tcp', term: 'TCP', definition: 'Transmission Control Protocol — provides reliable, ordered, error-checked delivery of data between applications.', conceptId: 'layer-4', badgeGroup: 'protocol-polyglot' },
  { id: 'udp', term: 'UDP', definition: 'User Datagram Protocol — fast, connectionless protocol with no delivery guarantees. Used for video, gaming, DNS.', conceptId: 'layer-4', badgeGroup: 'protocol-polyglot' },
  { id: 'connection-level-balancing', term: 'Connection-level Balancing', definition: 'Routing an entire TCP connection to one backend for its full lifetime, rather than per-request.', conceptId: 'layer-4', badgeGroup: 'protocol-polyglot' },
  { id: 'ipvs', term: 'IPVS', definition: 'IP Virtual Server — a Linux kernel module for high-performance Layer 4 load balancing.', conceptId: 'layer-4', badgeGroup: 'protocol-polyglot' },

  // ═══════════════ LAYER 7 ═══════════════
  { id: 'url-routing', term: 'URL Path Routing', definition: 'Directing requests to different backends based on the URL path (e.g., /api → service A, /static → CDN).', conceptId: 'layer-7', badgeGroup: 'protocol-polyglot' },
  { id: 'canary-deployment', term: 'Canary Deployment', definition: 'Routing a small percentage of traffic to a new version to test it in production before full rollout.', conceptId: 'layer-7', badgeGroup: 'protocol-polyglot' },
  { id: 'blue-green', term: 'Blue-Green Deployment', definition: 'Running two identical environments (blue/green) and switching traffic between them for zero-downtime deploys.', conceptId: 'layer-7', badgeGroup: 'protocol-polyglot' },
  { id: 'a-b-testing', term: 'A/B Testing', definition: 'Splitting traffic between variants to measure which performs better based on user behavior metrics.', conceptId: 'layer-7', badgeGroup: 'protocol-polyglot' },
  { id: 'ssl-termination', term: 'SSL Termination', definition: 'Decrypting TLS traffic at the load balancer/proxy so backends receive plain HTTP, offloading crypto work.', conceptId: 'layer-7', badgeGroup: 'protocol-polyglot' },

  // ═══════════════ SSL/TLS ═══════════════
  { id: 'tls-handshake', term: 'TLS Handshake', definition: 'The multi-step negotiation between client and server to establish an encrypted session (hello, certs, key exchange).', conceptId: 'ssl-tls', badgeGroup: 'protocol-polyglot' },
  { id: 'certificate-authority', term: 'Certificate Authority', definition: 'A trusted entity that issues digital certificates verifying that a server is who it claims to be.', conceptId: 'ssl-tls', badgeGroup: 'protocol-polyglot' },
  { id: 'mtls', term: 'mTLS', definition: 'Mutual TLS — both client and server present certificates to authenticate each other, common in service meshes.', conceptId: 'ssl-tls', badgeGroup: 'protocol-polyglot' },
  { id: 'zero-rtt', term: '0-RTT', definition: 'TLS 1.3 feature allowing resumed connections to send data without waiting for a handshake round-trip.', conceptId: 'ssl-tls', badgeGroup: 'protocol-polyglot' },

  // ═══════════════ CACHING ═══════════════
  { id: 'cache-aside', term: 'Cache-Aside', definition: 'Application checks cache first; on miss, loads from DB and stores in cache. Also called Lazy Loading.', conceptId: 'caching', badgeGroup: 'cache-commander' },
  { id: 'write-through', term: 'Write-Through', definition: 'Every write goes to both cache and DB simultaneously, ensuring cache is always consistent with storage.', conceptId: 'caching', badgeGroup: 'cache-commander' },
  { id: 'write-behind', term: 'Write-Behind', definition: 'Writes go to cache immediately and are asynchronously flushed to DB later, trading durability for speed.', conceptId: 'caching', badgeGroup: 'cache-commander' },
  { id: 'read-through', term: 'Read-Through', definition: 'Cache itself loads missing data from the DB transparently, so the app only ever talks to the cache.', conceptId: 'caching', badgeGroup: 'cache-commander' },
  { id: 'lru', term: 'LRU', definition: 'Least Recently Used — eviction policy that removes the item that hasn\'t been accessed for the longest time.', conceptId: 'caching', badgeGroup: 'cache-commander' },
  { id: 'lfu', term: 'LFU', definition: 'Least Frequently Used — eviction policy that removes the item accessed the fewest total times.', conceptId: 'caching', badgeGroup: 'cache-commander' },
  { id: 'ttl', term: 'TTL', definition: 'Time To Live — a countdown timer on cached data after which it expires and must be refreshed from source.', conceptId: 'caching', badgeGroup: 'cache-commander' },
  { id: 'cache-hit-ratio', term: 'Cache Hit Ratio', definition: 'Percentage of requests served from cache vs total requests. Higher = more effective caching.', conceptId: 'caching', badgeGroup: 'cache-commander' },
  { id: 'cache-invalidation', term: 'Cache Invalidation', definition: 'The notoriously hard problem of knowing when cached data is stale and needs to be refreshed or removed.', conceptId: 'caching', badgeGroup: 'cache-commander' },
  { id: 'cache-stampede', term: 'Cache Stampede', definition: 'When many requests simultaneously miss a cold cache entry and all hit the DB at once. Also called dog-piling.', conceptId: 'caching', badgeGroup: 'cache-commander' },

  // ═══════════════ SHARDING ═══════════════
  { id: 'shard-key', term: 'Shard Key', definition: 'The column/field used to determine which shard a piece of data belongs to. Poor choice = hot spots.', conceptId: 'sharding', badgeGroup: 'shard-surgeon' },
  { id: 'range-sharding', term: 'Range-based Sharding', definition: 'Splitting data by value ranges (e.g., A-M on shard 1, N-Z on shard 2). Simple but prone to uneven distribution.', conceptId: 'sharding', badgeGroup: 'shard-surgeon' },
  { id: 'hash-sharding', term: 'Hash-based Sharding', definition: 'Hashing the shard key to distribute data uniformly. Good distribution but loses range query ability.', conceptId: 'sharding', badgeGroup: 'shard-surgeon' },
  { id: 'directory-sharding', term: 'Directory-based Sharding', definition: 'A lookup table maps each key to its shard. Flexible but the directory itself becomes a bottleneck.', conceptId: 'sharding', badgeGroup: 'shard-surgeon' },
  { id: 'hot-spots', term: 'Hot Spots', definition: 'When one shard receives disproportionately more traffic than others due to skewed data or access patterns.', conceptId: 'sharding', badgeGroup: 'shard-surgeon' },
  { id: 'resharding', term: 'Resharding', definition: 'The painful process of redistributing data across shards when you add/remove shards or rebalance.', conceptId: 'sharding', badgeGroup: 'shard-surgeon' },
  { id: 'cross-shard-join', term: 'Cross-shard Join', definition: 'Joining data that lives on different shards — expensive because it requires network hops and coordination.', conceptId: 'sharding', badgeGroup: 'shard-surgeon' },

  // ═══════════════ CAP THEOREM ═══════════════
  { id: 'partition-tolerance', term: 'Partition Tolerance', definition: 'System continues operating despite network partitions (dropped/delayed messages between nodes).', conceptId: 'cap-theorem', badgeGroup: 'consistency-sage' },
  { id: 'strong-consistency', term: 'Strong Consistency', definition: 'Every read returns the most recent write. All nodes see the same data at the same time.', conceptId: 'cap-theorem', badgeGroup: 'consistency-sage' },
  { id: 'eventual-consistency', term: 'Eventual Consistency', definition: 'Given enough time without new writes, all replicas will converge to the same value. Reads may be stale.', conceptId: 'cap-theorem', badgeGroup: 'consistency-sage' },
  { id: 'pacelc', term: 'PACELC', definition: 'Extension of CAP: during Partition choose A or C; Else (no partition) choose Latency or Consistency.', conceptId: 'cap-theorem', badgeGroup: 'consistency-sage' },
  { id: 'cp-system', term: 'CP System', definition: 'A system that sacrifices Availability to maintain Consistency during partitions (e.g., HBase, MongoDB).', conceptId: 'cap-theorem', badgeGroup: 'consistency-sage' },
  { id: 'ap-system', term: 'AP System', definition: 'A system that sacrifices Consistency to maintain Availability during partitions (e.g., Cassandra, DynamoDB).', conceptId: 'cap-theorem', badgeGroup: 'consistency-sage' },
  { id: 'network-partition', term: 'Network Partition', definition: 'When network failures prevent some nodes from communicating with others, splitting the cluster.', conceptId: 'cap-theorem', badgeGroup: 'consistency-sage' },

  // ═══════════════ CONSISTENT HASHING ═══════════════
  { id: 'hash-ring', term: 'Hash Ring', definition: 'A circular hash space (0 to 2^32) where both nodes and keys are mapped to positions on the ring.', conceptId: 'consistent-hashing', badgeGroup: 'shard-surgeon' },
  { id: 'vnodes', term: 'Virtual Nodes', definition: 'Multiple hash positions per physical node on the ring, improving load distribution and rebalancing.', conceptId: 'consistent-hashing', badgeGroup: 'shard-surgeon' },
  { id: 'key-remapping', term: 'Key Remapping', definition: 'When a node joins/leaves, only K/N keys need to move (K=total keys, N=nodes) instead of rehashing everything.', conceptId: 'consistent-hashing', badgeGroup: 'shard-surgeon' },

  // ═══════════════ MESSAGE QUEUES ═══════════════
  { id: 'dead-letter-queue', term: 'Dead Letter Queue', definition: 'A holding queue for messages that repeatedly fail processing, preventing them from blocking the main queue.', conceptId: 'message-queues', badgeGroup: 'queue-whisperer' },
  { id: 'at-most-once', term: 'At-most-once', definition: 'Delivery guarantee where messages may be lost but never delivered twice. Fire-and-forget.', conceptId: 'message-queues', badgeGroup: 'queue-whisperer' },
  { id: 'at-least-once', term: 'At-least-once', definition: 'Delivery guarantee where messages are never lost but may be delivered multiple times. Requires idempotent consumers.', conceptId: 'message-queues', badgeGroup: 'queue-whisperer' },
  { id: 'exactly-once', term: 'Exactly-once', definition: 'The holy grail of delivery guarantees — each message processed exactly once. Very expensive to achieve.', conceptId: 'message-queues', badgeGroup: 'queue-whisperer' },
  { id: 'idempotent-consumer', term: 'Idempotent Consumer', definition: 'A consumer that produces the same result whether it processes a message once or multiple times.', conceptId: 'message-queues', badgeGroup: 'queue-whisperer' },
  { id: 'backpressure', term: 'Backpressure', definition: 'A flow control mechanism where consumers signal producers to slow down when they can\'t keep up.', conceptId: 'message-queues', badgeGroup: 'queue-whisperer' },
  { id: 'message-ordering', term: 'Message Ordering', definition: 'Guaranteeing messages are processed in the order they were sent — hard across partitions/consumers.', conceptId: 'message-queues', badgeGroup: 'queue-whisperer' },
  { id: 'consumer-group', term: 'Consumer Group', definition: 'Multiple consumers sharing the work of processing messages from a topic, each handling different partitions.', conceptId: 'message-queues', badgeGroup: 'queue-whisperer' },

  // ═══════════════ MICROSERVICES ═══════════════
  { id: 'service-discovery', term: 'Service Discovery', definition: 'Mechanism for services to find each other\'s network locations dynamically (e.g., Consul, Eureka, K8s DNS).', conceptId: 'microservices', badgeGroup: 'gateway-guardian' },
  { id: 'distributed-tracing', term: 'Distributed Tracing', definition: 'Tracking a request as it flows through multiple services, showing latency and errors at each hop.', conceptId: 'microservices', badgeGroup: 'gateway-guardian' },
  { id: 'ddd', term: 'Domain-Driven Design', definition: 'An approach to software design that models complex systems around business domain boundaries.', conceptId: 'microservices', badgeGroup: 'gateway-guardian' },
  { id: 'saga-pattern', term: 'Saga Pattern', definition: 'A sequence of local transactions across services with compensating actions to roll back on failure.', conceptId: 'microservices', badgeGroup: 'gateway-guardian' },
  { id: 'event-sourcing', term: 'Event Sourcing', definition: 'Storing every state change as an immutable event, allowing full replay and audit of system history.', conceptId: 'microservices', badgeGroup: 'gateway-guardian' },
  { id: 'grpc', term: 'gRPC', definition: 'A high-performance RPC framework using Protocol Buffers for serialization and HTTP/2 for transport.', conceptId: 'microservices', badgeGroup: 'protocol-polyglot' },

  // ═══════════════ DB REPLICATION ═══════════════
  { id: 'leader-follower', term: 'Leader-Follower', definition: 'Replication where one node (leader) accepts writes and propagates them to read-only followers.', conceptId: 'db-replication', badgeGroup: 'replication-ranger' },
  { id: 'multi-master', term: 'Multi-Master', definition: 'Replication where any node can accept writes. Powerful but requires conflict resolution.', conceptId: 'db-replication', badgeGroup: 'replication-ranger' },
  { id: 'replication-lag', term: 'Replication Lag', definition: 'The delay between a write on the leader and that write appearing on followers. Causes stale reads.', conceptId: 'db-replication', badgeGroup: 'replication-ranger' },
  { id: 'sync-replication', term: 'Synchronous Replication', definition: 'Leader waits for followers to confirm the write before acknowledging. Consistent but slow.', conceptId: 'db-replication', badgeGroup: 'replication-ranger' },
  { id: 'async-replication', term: 'Asynchronous Replication', definition: 'Leader acknowledges immediately and propagates later. Fast but followers may serve stale data.', conceptId: 'db-replication', badgeGroup: 'replication-ranger' },
  { id: 'conflict-resolution', term: 'Conflict Resolution', definition: 'Strategies for handling conflicting writes in multi-master setups (last-write-wins, vector clocks, CRDTs).', conceptId: 'db-replication', badgeGroup: 'replication-ranger' },

  // ═══════════════ RATE LIMITING ═══════════════
  { id: 'token-bucket', term: 'Token Bucket', definition: 'Rate limiting algorithm where tokens refill at a fixed rate; each request costs one token. Allows bursts.', conceptId: 'rate-limiting', badgeGroup: 'rate-limiter-lord' },
  { id: 'leaky-bucket', term: 'Leaky Bucket', definition: 'Rate limiting that processes requests at a fixed rate like water leaking from a bucket. Smooths bursts.', conceptId: 'rate-limiting', badgeGroup: 'rate-limiter-lord' },
  { id: 'fixed-window', term: 'Fixed Window', definition: 'Counts requests in fixed time windows (e.g., 100/minute). Simple but has burst issues at window boundaries.', conceptId: 'rate-limiting', badgeGroup: 'rate-limiter-lord' },
  { id: 'sliding-window', term: 'Sliding Window', definition: 'Tracks requests over a rolling time window, smoothing out the boundary burst problem of fixed windows.', conceptId: 'rate-limiting', badgeGroup: 'rate-limiter-lord' },
  { id: 'http-429', term: 'HTTP 429', definition: 'Too Many Requests — the standard HTTP status code returned when a client exceeds their rate limit.', conceptId: 'rate-limiting', badgeGroup: 'rate-limiter-lord' },

  // ═══════════════ CDN ═══════════════
  { id: 'edge-location', term: 'Edge Location', definition: 'A data center at the network edge (close to users) that caches and serves content. Also called a PoP.', conceptId: 'cdn', badgeGroup: 'edge-explorer' },
  { id: 'pop', term: 'PoP', definition: 'Point of Presence — a physical location where a CDN has servers to serve nearby users with low latency.', conceptId: 'cdn', badgeGroup: 'edge-explorer' },
  { id: 'origin-server', term: 'Origin Server', definition: 'The original source of truth that CDN edge locations pull content from on a cache miss.', conceptId: 'cdn', badgeGroup: 'edge-explorer' },
  { id: 'cache-purge', term: 'Cache Purge', definition: 'Forcibly invalidating cached content across all CDN edge locations, usually via API call.', conceptId: 'cdn', badgeGroup: 'edge-explorer' },
  { id: 'anycast', term: 'Anycast', definition: 'Routing technique where the same IP address is announced from multiple locations; traffic goes to the nearest one.', conceptId: 'cdn', badgeGroup: 'edge-explorer' },

  // ═══════════════ API GATEWAY ═══════════════
  { id: 'bff', term: 'BFF', definition: 'Backend-for-Frontend — a dedicated API layer tailored to a specific client type (mobile, web, IoT).', conceptId: 'api-gateway', badgeGroup: 'gateway-guardian' },
  { id: 'request-aggregation', term: 'Request Aggregation', definition: 'Combining multiple backend service calls into a single client-facing response to reduce round trips.', conceptId: 'api-gateway', badgeGroup: 'gateway-guardian' },

  // ═══════════════ INDEXING ═══════════════
  { id: 'b-tree', term: 'B-tree', definition: 'Self-balancing tree data structure used by most databases for indexes. Excellent for range queries and ordered access.', conceptId: 'indexing', badgeGroup: 'index-architect' },
  { id: 'hash-index', term: 'Hash Index', definition: 'An index using a hash table for O(1) exact-match lookups. Cannot do range queries.', conceptId: 'indexing', badgeGroup: 'index-architect' },
  { id: 'composite-index', term: 'Composite Index', definition: 'An index spanning multiple columns. Column order matters — queries must use a left prefix to benefit.', conceptId: 'indexing', badgeGroup: 'index-architect' },
  { id: 'covering-index', term: 'Covering Index', definition: 'An index that includes all columns a query needs, eliminating the need to read the actual table rows.', conceptId: 'indexing', badgeGroup: 'index-architect' },
  { id: 'query-planner', term: 'Query Planner', definition: 'Database component that analyzes queries and chooses the optimal execution plan (which indexes to use, join order).', conceptId: 'indexing', badgeGroup: 'index-architect' },

  // ═══════════════ ROUND ROBIN (concept) ═══════════════
  { id: 'stateless-lb', term: 'Stateless', definition: 'A load balancer that makes routing decisions without tracking any per-connection or per-client state.', conceptId: 'round-robin', badgeGroup: 'balance-master' },

  // ═══════════════ LEAST CONNECTIONS (concept) ═══════════════
  { id: 'thundering-herd', term: 'Thundering Herd', definition: 'When a new server joins with 0 connections and gets flooded because the LB thinks it\'s the least loaded.', conceptId: 'least-connections', badgeGroup: 'balance-master' },
  { id: 'connection-tracking', term: 'Connection Tracking', definition: 'The LB maintaining a real-time count of active connections per backend to make routing decisions.', conceptId: 'least-connections', badgeGroup: 'balance-master' },

  // ═══════════════ IP HASH (concept) ═══════════════
  { id: 'session-affinity', term: 'Session Affinity', definition: 'Ensuring a client\'s requests always go to the same server, preserving session state without shared storage.', conceptId: 'ip-hash', badgeGroup: 'balance-master' },
  { id: 'nat', term: 'NAT', definition: 'Network Address Translation — many clients sharing one public IP, which breaks IP-hash-based routing fairness.', conceptId: 'ip-hash', badgeGroup: 'protocol-polyglot' },

  // ═══════════════ NGINX ═══════════════
  { id: 'reverse-proxy', term: 'Reverse Proxy', definition: 'A server that sits in front of backends, forwarding client requests to them and returning the responses.', conceptId: 'nginx', badgeGroup: 'gateway-guardian' },
  { id: 'event-driven', term: 'Event-driven Architecture', definition: 'Processing thousands of connections in a single thread using non-blocking I/O and event loops.', conceptId: 'nginx', badgeGroup: 'gateway-guardian' },
  { id: 'upstream', term: 'Upstream', definition: 'In NGINX/proxy config, the backend server group that receives forwarded requests.', conceptId: 'nginx', badgeGroup: 'gateway-guardian' },

  // ═══════════════ HAPROXY ═══════════════
  { id: 'high-availability', term: 'High Availability', definition: 'System design goal of minimizing downtime, typically measured as "nines" (99.9%, 99.99%, etc.).', conceptId: 'haproxy', badgeGroup: 'gateway-guardian' },
  { id: 'ecmp', term: 'ECMP', definition: 'Equal-Cost Multi-Path routing — distributing traffic across multiple equal-cost network paths at Layer 3.', conceptId: 'haproxy', badgeGroup: 'protocol-polyglot' },

  // ═══════════════ AWS LB ═══════════════
  { id: 'alb', term: 'ALB', definition: 'Application Load Balancer — AWS Layer 7 LB that routes by URL, headers, and query strings.', conceptId: 'aws-lb', badgeGroup: 'edge-explorer' },
  { id: 'nlb', term: 'NLB', definition: 'Network Load Balancer — AWS Layer 4 LB with ~100us latency, ideal for TCP/UDP workloads.', conceptId: 'aws-lb', badgeGroup: 'edge-explorer' },
  { id: 'target-group', term: 'Target Group', definition: 'A logical grouping of backends (instances, IPs, lambdas) that an AWS load balancer routes traffic to.', conceptId: 'aws-lb', badgeGroup: 'edge-explorer' },
  { id: 'lcu', term: 'LCU', definition: 'Load Balancer Capacity Unit — AWS pricing metric based on connections, bandwidth, and rule evaluations.', conceptId: 'aws-lb', badgeGroup: 'edge-explorer' },

  // ═══════════════ GCP LB ═══════════════
  { id: 'anycast-ip', term: 'Anycast IP', definition: 'A single global IP that routes users to the nearest GCP edge, providing worldwide coverage with one address.', conceptId: 'gcp-lb', badgeGroup: 'edge-explorer' },
  { id: 'cloud-armor', term: 'Cloud Armor', definition: 'GCP\'s DDoS protection and WAF (Web Application Firewall) service integrated with their load balancers.', conceptId: 'gcp-lb', badgeGroup: 'edge-explorer' },
  { id: 'neg', term: 'NEG', definition: 'Network Endpoint Group — GCP resource that specifies a group of backend endpoints for load balancing.', conceptId: 'gcp-lb', badgeGroup: 'edge-explorer' },

  // ═══════════════ WEIGHTED ROUND ROBIN (concept) ═══════════════
  { id: 'server-weight', term: 'Server Weight', definition: 'A numeric value assigned to a server proportional to its capacity, determining its share of traffic.', conceptId: 'weighted-round-robin', badgeGroup: 'balance-master' },
  { id: 'heterogeneity', term: 'Heterogeneity', definition: 'The reality that requests vary in size, duration, and resource cost — and servers differ in capacity, making uniform distribution suboptimal.', conceptId: 'weighted-round-robin', badgeGroup: 'balance-master' },

  // ═══════════════ NETWORK LAYERS / GENERAL ═══════════════
  { id: 'websocket', term: 'WebSocket', definition: 'Full-duplex communication protocol over a single TCP connection, enabling real-time bidirectional data.', conceptId: 'layer-7', badgeGroup: 'protocol-polyglot' },
  { id: 'http2', term: 'HTTP/2', definition: 'Major revision of HTTP with multiplexing (multiple requests over one connection), header compression, and server push.', conceptId: 'layer-7', badgeGroup: 'protocol-polyglot' },
]

export const jargonBadges: JargonBadge[] = [
  {
    id: 'balance-master',
    name: 'Balance Master',
    description: 'Master all load balancing algorithm and strategy terms',
    icon: 'Scale',
    termIds: ['round-robin-algo', 'least-connections-algo', 'ip-hash-algo', 'weighted-rr-algo', 'health-checks', 'sticky-sessions', 'active-passive', 'active-active', 'stateless-lb', 'thundering-herd', 'connection-tracking', 'session-affinity', 'server-weight', 'heterogeneity'],
  },
  {
    id: 'protocol-polyglot',
    name: 'Protocol Polyglot',
    description: 'Learn all networking protocol and layer terms',
    icon: 'Globe',
    termIds: ['tcp', 'udp', 'connection-level-balancing', 'ipvs', 'url-routing', 'canary-deployment', 'blue-green', 'a-b-testing', 'ssl-termination', 'tls-handshake', 'certificate-authority', 'mtls', 'zero-rtt', 'grpc', 'nat', 'ecmp', 'websocket', 'http2'],
  },
  {
    id: 'cache-commander',
    name: 'Cache Commander',
    description: 'Master all caching strategies and patterns',
    icon: 'Zap',
    termIds: ['cache-aside', 'write-through', 'write-behind', 'read-through', 'lru', 'lfu', 'ttl', 'cache-hit-ratio', 'cache-invalidation', 'cache-stampede'],
  },
  {
    id: 'queue-whisperer',
    name: 'Queue Whisperer',
    description: 'Understand all message queue delivery and processing terms',
    icon: 'Inbox',
    termIds: ['dead-letter-queue', 'at-most-once', 'at-least-once', 'exactly-once', 'idempotent-consumer', 'backpressure', 'message-ordering', 'consumer-group'],
  },
  {
    id: 'shard-surgeon',
    name: 'Shard Surgeon',
    description: 'Master data partitioning and distribution techniques',
    icon: 'Scissors',
    termIds: ['shard-key', 'range-sharding', 'hash-sharding', 'directory-sharding', 'hot-spots', 'resharding', 'cross-shard-join', 'hash-ring', 'vnodes', 'key-remapping'],
  },
  {
    id: 'consistency-sage',
    name: 'Consistency Sage',
    description: 'Understand CAP theorem and consistency models deeply',
    icon: 'Shield',
    termIds: ['partition-tolerance', 'strong-consistency', 'eventual-consistency', 'pacelc', 'cp-system', 'ap-system', 'network-partition'],
  },
  {
    id: 'index-architect',
    name: 'Index Architect',
    description: 'Know all database indexing structures and strategies',
    icon: 'Library',
    termIds: ['b-tree', 'hash-index', 'composite-index', 'covering-index', 'query-planner'],
  },
  {
    id: 'replication-ranger',
    name: 'Replication Ranger',
    description: 'Master database replication patterns and trade-offs',
    icon: 'Copy',
    termIds: ['leader-follower', 'multi-master', 'replication-lag', 'sync-replication', 'async-replication', 'conflict-resolution'],
  },
  {
    id: 'gateway-guardian',
    name: 'Gateway Guardian',
    description: 'Learn all API gateway, proxy, and service mesh terms',
    icon: 'DoorOpen',
    termIds: ['service-discovery', 'distributed-tracing', 'ddd', 'saga-pattern', 'event-sourcing', 'bff', 'request-aggregation', 'reverse-proxy', 'event-driven', 'upstream', 'high-availability'],
  },
  {
    id: 'rate-limiter-lord',
    name: 'Rate Limiter Lord',
    description: 'Master all throttling algorithms and patterns',
    icon: 'Gauge',
    termIds: ['token-bucket', 'leaky-bucket', 'fixed-window', 'sliding-window', 'http-429'],
  },
  {
    id: 'edge-explorer',
    name: 'Edge Explorer',
    description: 'Discover all CDN and cloud infrastructure terms',
    icon: 'MapPin',
    termIds: ['edge-location', 'pop', 'origin-server', 'cache-purge', 'anycast', 'alb', 'nlb', 'target-group', 'lcu', 'anycast-ip', 'cloud-armor', 'neg'],
  },
  {
    id: 'jargon-collector',
    name: 'Jargon Collector',
    description: 'Discover 50 jargon terms — you\'re becoming fluent!',
    icon: 'Trophy',
    termIds: [],
  },
  {
    id: 'walking-glossary',
    name: 'Walking Glossary',
    description: 'Discover 100 jargon terms — people come to you for definitions',
    icon: 'BookOpen',
    termIds: [],
  },
  {
    id: 'omniscient',
    name: 'The Omniscient',
    description: 'Discover every single jargon term — you ARE the system design encyclopedia',
    icon: 'Crown',
    termIds: [],
  },
]
