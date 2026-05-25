import { Concept } from '@/types'

export const concepts: Concept[] = [
  {
    id: 'load-balancing',
    title: 'Load Balancing',
    category: 'networking',
    definition:
      'A technique to distribute incoming network traffic across multiple servers to ensure no single server bears too much load, improving availability and responsiveness.',
    keyPoints: [
      'Common algorithms: Round Robin, Least Connections, IP Hash, Weighted Round Robin',
      'Can operate at Layer 4 (TCP/UDP) or Layer 7 (HTTP/Application)',
      'Health checks continuously monitor backend server availability',
      'Examples: NGINX, HAProxy, AWS ALB/NLB, Google Cloud Load Balancer',
    ],
    tradeoffs: [
      'Single point of failure if not deployed redundantly (active-passive or active-active)',
      'Layer 7 LB offers smarter routing but adds latency vs Layer 4',
      'Session affinity (sticky sessions) simplifies state but reduces distribution effectiveness',
    ],
  },
  {
    id: 'caching',
    title: 'Caching',
    category: 'caching',
    definition:
      'Storing frequently accessed data in a fast-access storage layer (like memory) to reduce latency and database load for subsequent requests.',
    keyPoints: [
      'Cache levels: Client-side, CDN, Application (Redis/Memcached), Database query cache',
      'Strategies: Cache-Aside (Lazy), Write-Through, Write-Behind, Read-Through',
      'Eviction policies: LRU, LFU, FIFO, TTL-based expiration',
      'Cache hit ratio is the key metric for cache effectiveness',
    ],
    tradeoffs: [
      'Cache invalidation is one of the hardest problems in CS — stale data risk',
      'Write-through ensures consistency but adds write latency',
      'Write-behind improves write performance but risks data loss on cache failure',
    ],
  },
  {
    id: 'sharding',
    title: 'Database Sharding',
    category: 'databases',
    definition:
      'Horizontal partitioning of data across multiple database instances, where each shard holds a subset of the total data based on a shard key.',
    keyPoints: [
      'Shard key selection is critical — determines data distribution and query routing',
      'Types: Range-based, Hash-based, Directory-based (lookup table)',
      'Enables horizontal scaling beyond single-machine limits',
      'Cross-shard queries and joins become expensive or impossible',
    ],
    tradeoffs: [
      'Adds significant operational complexity (rebalancing, backup, schema changes)',
      'Hot spots can occur with poor shard key selection',
      'Resharding (changing shard count) is very disruptive without consistent hashing',
    ],
  },
  {
    id: 'cap-theorem',
    title: 'CAP Theorem',
    category: 'reliability',
    definition:
      'States that a distributed system can only guarantee two of three properties simultaneously: Consistency, Availability, and Partition Tolerance.',
    keyPoints: [
      'Partition Tolerance is non-negotiable in distributed systems — network partitions will happen',
      'CP systems (e.g., HBase, MongoDB) sacrifice availability during partitions',
      'AP systems (e.g., Cassandra, DynamoDB) sacrifice consistency during partitions',
      'PACELC extends CAP: during Partition choose A or C, Else choose Latency or Consistency',
    ],
    tradeoffs: [
      'Strong consistency (CP) means higher latency and potential unavailability',
      'Eventual consistency (AP) means faster responses but temporarily stale reads',
      'Most real systems operate on a spectrum, not strictly CP or AP',
    ],
  },
  {
    id: 'consistent-hashing',
    title: 'Consistent Hashing',
    category: 'scalability',
    definition:
      'A hashing technique that minimizes key remapping when the number of nodes changes, making it ideal for distributed caches and databases.',
    keyPoints: [
      'Nodes and keys are mapped onto a virtual ring (hash space)',
      'Adding/removing a node only affects neighboring keys on the ring',
      'Virtual nodes (vnodes) improve load distribution across physical nodes',
      'Used by: DynamoDB, Cassandra, Akamai CDN, Discord',
    ],
    tradeoffs: [
      'More complex to implement than simple modulo hashing',
      'Virtual nodes add memory overhead but are necessary for balance',
      'Still requires rebalancing logic when nodes join or leave',
    ],
  },
  {
    id: 'message-queues',
    title: 'Message Queues',
    category: 'messaging',
    definition:
      'Asynchronous communication mechanism where producers send messages to a queue and consumers process them independently, decoupling system components.',
    keyPoints: [
      'Enables asynchronous processing, peak load buffering, and service decoupling',
      'Delivery guarantees: At-most-once, At-least-once, Exactly-once',
      'Popular systems: Kafka (log-based), RabbitMQ (broker), SQS (managed)',
      'Dead letter queues handle messages that fail processing repeatedly',
    ],
    tradeoffs: [
      'Adds eventual consistency — consumers process messages with delay',
      'Message ordering is hard to guarantee across partitions (Kafka) or consumers',
      'Exactly-once delivery is expensive and often requires idempotent consumers',
    ],
  },
  {
    id: 'microservices',
    title: 'Microservices',
    category: 'architecture',
    definition:
      'An architectural style where an application is composed of small, independently deployable services, each owning its own data and business logic.',
    keyPoints: [
      'Each service is independently deployable, scalable, and can use different tech stacks',
      'Communication via REST, gRPC, or async messaging (events)',
      'Requires service discovery, API gateway, and distributed tracing',
      'Domain-Driven Design (DDD) helps define service boundaries',
    ],
    tradeoffs: [
      'Operational complexity increases dramatically (deployment, monitoring, debugging)',
      'Network latency replaces in-process calls — distributed system challenges emerge',
      'Data consistency across services requires patterns like Saga or Event Sourcing',
    ],
  },
  {
    id: 'db-replication',
    title: 'Database Replication',
    category: 'databases',
    definition:
      'Maintaining copies of the same data on multiple database servers to improve read performance, availability, and fault tolerance.',
    keyPoints: [
      'Leader-Follower (Master-Slave): writes go to leader, reads can go to followers',
      'Leader-Leader (Multi-Master): writes go to any node, conflict resolution needed',
      'Synchronous replication ensures consistency but adds latency',
      'Asynchronous replication is faster but followers may serve stale data',
    ],
    tradeoffs: [
      'Replication lag in async setups can cause inconsistent reads',
      'Multi-master replication requires complex conflict resolution',
      'More replicas = more read throughput but higher write overhead',
    ],
  },
  {
    id: 'rate-limiting',
    title: 'Rate Limiting',
    category: 'networking',
    definition:
      'Controlling the rate of requests a client can make to an API or service within a given time window to prevent abuse and ensure fair usage.',
    keyPoints: [
      'Algorithms: Token Bucket, Leaky Bucket, Fixed Window, Sliding Window Log/Counter',
      'Can be applied per-user, per-IP, per-API-key, or globally',
      'Return HTTP 429 (Too Many Requests) when limit is exceeded',
      'Distributed rate limiting often uses Redis for shared state across instances',
    ],
    tradeoffs: [
      'Too aggressive limits hurt legitimate users; too lenient limits fail to protect',
      'Fixed window has burst edge case at window boundaries',
      'Sliding window is more accurate but requires more memory/computation',
    ],
  },
  {
    id: 'cdn',
    title: 'Content Delivery Network',
    category: 'caching',
    definition:
      'A geographically distributed network of proxy servers that cache and serve content from edge locations closest to users, reducing latency.',
    keyPoints: [
      'Caches static content (images, CSS, JS) and can accelerate dynamic content',
      'Edge locations (PoPs) serve content, origin server is the source of truth',
      'Cache invalidation via TTL, versioned URLs, or purge APIs',
      'Examples: CloudFront, Cloudflare, Akamai, Fastly',
    ],
    tradeoffs: [
      'Cache invalidation can be slow across all edge locations',
      'Adds cost that scales with traffic volume and geographic reach',
      'Not effective for highly personalized or real-time dynamic content',
    ],
  },
  {
    id: 'api-gateway',
    title: 'API Gateway',
    category: 'architecture',
    definition:
      'A single entry point for all client requests that handles cross-cutting concerns like authentication, rate limiting, routing, and protocol translation.',
    keyPoints: [
      'Aggregates multiple microservice calls into a single client request',
      'Handles auth, SSL termination, request/response transformation, logging',
      'Can implement Backend-for-Frontend (BFF) pattern for different client types',
      'Examples: Kong, AWS API Gateway, NGINX, Envoy',
    ],
    tradeoffs: [
      'Single point of failure — must be highly available and horizontally scaled',
      'Adds latency to every request as an additional network hop',
      'Can become a bottleneck if too much logic is placed in the gateway',
    ],
  },
  {
    id: 'indexing',
    title: 'Database Indexing',
    category: 'databases',
    definition:
      'Data structures (typically B-trees or hash indexes) that speed up data retrieval operations on a database at the cost of additional storage and write overhead.',
    keyPoints: [
      'B-tree indexes: great for range queries and ordered data access',
      'Hash indexes: O(1) lookups for exact-match queries only',
      'Composite indexes cover multiple columns — column order matters for query optimization',
      'Covering indexes include all columns needed by a query, avoiding table lookups',
    ],
    tradeoffs: [
      'Every index slows down writes (INSERT, UPDATE, DELETE) due to index maintenance',
      'Indexes consume additional disk space (can be significant for large tables)',
      'Too many indexes can actually hurt performance — the query planner may choose poorly',
    ],
  },
  {
    id: 'round-robin',
    title: 'Round Robin',
    category: 'networking',
    definition:
      'A load balancing algorithm that distributes requests sequentially across a pool of servers in circular order, giving each server an equal share of traffic.',
    keyPoints: [
      'Simplest load balancing algorithm — cycles through servers 1, 2, 3, ..., N, 1, 2, ...',
      'Works best when all servers have equal capacity and requests have similar processing cost',
      'Stateless — no need to track server load or connection count',
      'Weighted Round Robin assigns more requests to stronger servers based on configured weights',
    ],
    tradeoffs: [
      'Ignores server health and current load — a slow server still gets its share of requests',
      'Poor fit when requests vary wildly in processing time (e.g., video encoding vs. health check)',
      'No session affinity — consecutive requests from the same client hit different servers',
    ],
  },
  {
    id: 'least-connections',
    title: 'Least Connections',
    category: 'networking',
    definition:
      'A load balancing algorithm that routes each new request to the server with the fewest active connections, adapting to real-time server load.',
    keyPoints: [
      'Dynamically adapts to varying request processing times across servers',
      'Weighted Least Connections factors in server capacity alongside connection count',
      'Requires the load balancer to track active connections per server (stateful)',
      'Best for long-lived connections like WebSockets, database pools, or file uploads',
    ],
    tradeoffs: [
      'Slightly more overhead than Round Robin due to connection tracking',
      'Connection count is a proxy for load — a server with 10 idle connections may be less busy than one with 2 heavy connections',
      'New servers get flooded initially since they start with 0 connections (thundering herd)',
    ],
  },
  {
    id: 'ip-hash',
    title: 'IP Hash',
    category: 'networking',
    definition:
      'A load balancing algorithm that hashes the client IP address to deterministically route all requests from the same client to the same backend server.',
    keyPoints: [
      'Provides natural session affinity (sticky sessions) without cookies or tokens',
      'Hash function maps client IP to a server index: server = hash(client_ip) % N',
      'Related to consistent hashing — but simple modulo hashing causes full redistribution when N changes',
      'Often used for stateful applications where session data is stored locally on the server',
    ],
    tradeoffs: [
      'Uneven distribution if many clients share a public IP (NAT, corporate proxies)',
      'Adding/removing servers reshuffles most client-to-server mappings (unless using consistent hashing)',
      'Breaks down with IPv6 where clients may have rotating addresses',
    ],
  },
  {
    id: 'weighted-round-robin',
    title: 'Weighted Round Robin',
    category: 'networking',
    definition:
      'An extension of Round Robin where each server is assigned a weight proportional to its capacity, so more powerful servers receive a larger share of requests.',
    keyPoints: [
      'Weights are configured based on server specs (CPU, RAM, network bandwidth)',
      'A server with weight 3 receives 3x the requests of a server with weight 1',
      'Commonly used in heterogeneous server environments (mixed instance sizes)',
      'NGINX and HAProxy support weighted round robin natively in their upstream configuration',
    ],
    tradeoffs: [
      'Weights are static — dont adapt if a high-weight server becomes slow or degraded',
      'Requires manual tuning of weights when server fleet changes',
      'Still ignores actual request cost — a weight-3 server getting expensive queries may underperform',
    ],
  },
  {
    id: 'layer-4',
    title: 'Layer 4 (Transport)',
    category: 'networking',
    definition:
      'The Transport layer of the OSI model handles end-to-end communication using TCP and UDP protocols. Layer 4 load balancers route traffic based on IP address and port number without inspecting packet contents, making them extremely fast.',
    keyPoints: [
      'Protocols: TCP (reliable, ordered) and UDP (fast, connectionless) operate here',
      'L4 load balancers make routing decisions using only source/destination IP + port — no content inspection',
      'Connection-level balancing: each TCP connection is routed to one backend for its entire lifetime',
      'Examples: AWS NLB, HAProxy (TCP mode), IPVS, Linux iptables/nftables-based balancers',
    ],
    tradeoffs: [
      'Cannot route based on HTTP headers, URLs, cookies, or request content — limited routing intelligence',
      'Very fast (~100us latency added) since no protocol parsing beyond IP/TCP headers',
      'Cannot do SSL termination — encrypted traffic is forwarded as-is unless paired with a TLS proxy',
    ],
  },
  {
    id: 'layer-7',
    title: 'Layer 7 (Application)',
    category: 'networking',
    definition:
      'The Application layer of the OSI model handles protocol-specific communication (HTTP, gRPC, WebSocket). Layer 7 load balancers can inspect request content and make intelligent routing decisions based on URLs, headers, cookies, and more.',
    keyPoints: [
      'Can route requests by URL path, hostname, HTTP headers, cookies, query parameters, and body content',
      'Enables advanced patterns: A/B testing, canary deployments, blue-green, API versioning',
      'Performs SSL/TLS termination — decrypts traffic, inspects it, then optionally re-encrypts to backends',
      'Examples: AWS ALB, NGINX, Envoy, Cloudflare, Google Cloud HTTP(S) LB, Traefik',
    ],
    tradeoffs: [
      'Adds 1-5ms latency per request due to full HTTP parsing and potential TLS termination',
      'Must understand the application protocol — cannot handle arbitrary TCP/UDP like Layer 4',
      'More resource-intensive (CPU for parsing + memory for request buffering) than L4 balancers',
    ],
  },
  {
    id: 'ssl-tls',
    title: 'SSL/TLS',
    category: 'networking',
    definition:
      'SSL (Secure Sockets Layer) and its successor TLS (Transport Layer Security) are cryptographic protocols that provide encrypted communication between clients and servers, ensuring data confidentiality, integrity, and authentication.',
    keyPoints: [
      'TLS handshake: client hello → server hello + certificate → key exchange → encrypted session established',
      'TLS 1.3 reduced the handshake to 1 round-trip (1-RTT) or even 0-RTT for resumed connections',
      'Certificates are issued by Certificate Authorities (CAs) — Let\'s Encrypt provides free automated certs',
      'SSL termination at the load balancer/reverse proxy offloads decryption from backend servers',
    ],
    tradeoffs: [
      'TLS handshake adds latency (1-2 RTT for TLS 1.2, 1 RTT for TLS 1.3) on first connection',
      'SSL termination at the LB means traffic between LB and backends may be unencrypted (use mTLS for end-to-end)',
      'Certificate management at scale requires automation (cert-manager, ACM, Let\'s Encrypt) to avoid expiry outages',
    ],
  },
  {
    id: 'nginx',
    title: 'NGINX',
    category: 'architecture',
    definition:
      'A high-performance, event-driven web server and reverse proxy that is widely used as a load balancer, API gateway, and static file server in production systems.',
    keyPoints: [
      'Event-driven, non-blocking architecture handles thousands of concurrent connections with low memory',
      'Supports Layer 7 load balancing with Round Robin, Least Connections, IP Hash, and Weighted Round Robin',
      'Acts as a reverse proxy, SSL terminator, caching layer, and rate limiter in one process',
      'NGINX Plus (commercial) adds health checks, session persistence, and live activity monitoring',
    ],
    tradeoffs: [
      'Configuration-file driven — changes require reload (though NGINX Plus supports dynamic upstreams)',
      'Layer 7 only (no native Layer 4 TCP/UDP LB in open-source; NGINX Plus and stream module add it)',
      'Less feature-rich than dedicated API gateways like Kong for auth plugins and transformations',
    ],
  },
  {
    id: 'haproxy',
    title: 'HAProxy',
    category: 'architecture',
    definition:
      'A high-availability, open-source load balancer and proxy server known for extreme performance and reliability, widely used for TCP (Layer 4) and HTTP (Layer 7) traffic.',
    keyPoints: [
      'Supports both Layer 4 (TCP) and Layer 7 (HTTP) load balancing natively',
      'Algorithms: Round Robin, Least Connections, Source IP Hash, URI Hash, and more',
      'Built-in health checks with configurable intervals, thresholds, and check types',
      'Used by GitHub, Stack Overflow, Reddit, and Airbnb for production traffic',
    ],
    tradeoffs: [
      'No built-in caching or static file serving — often paired with NGINX or a CDN',
      'Configuration is powerful but has a steep learning curve compared to NGINX',
      'Single-process model — horizontal scaling requires multiple HAProxy instances behind DNS/ECMP',
    ],
  },
  {
    id: 'aws-lb',
    title: 'AWS ALB / NLB',
    category: 'architecture',
    definition:
      'AWS Elastic Load Balancing offers Application Load Balancer (ALB, Layer 7) and Network Load Balancer (NLB, Layer 4) as managed, auto-scaling load balancing services.',
    keyPoints: [
      'ALB (Layer 7): routes by URL path, hostname, headers, query strings — ideal for microservices and containers',
      'NLB (Layer 4): routes TCP/UDP by IP+port with ultra-low latency (~100us) — ideal for gaming, IoT, real-time',
      'Both integrate with Auto Scaling, ECS, EKS, and AWS Certificate Manager for SSL',
      'ALB supports weighted target groups for blue/green and canary deployments',
    ],
    tradeoffs: [
      'Vendor lock-in — tightly coupled with AWS ecosystem (target groups, security groups, VPC)',
      'ALB adds ~1-5ms latency per hop; NLB adds ~100us but cannot inspect HTTP content',
      'Cost scales with traffic (LCU pricing for ALB) — can be expensive at very high throughput',
    ],
  },
  {
    id: 'gcp-lb',
    title: 'Google Cloud Load Balancer',
    category: 'architecture',
    definition:
      'Google Cloud offers a suite of global and regional load balancers built on the same infrastructure that powers Google Search and YouTube, providing a single anycast IP for global traffic distribution.',
    keyPoints: [
      'Global HTTP(S) LB: single anycast IP, Layer 7, routes to the nearest healthy backend worldwide',
      'TCP/SSL Proxy LB: Layer 4 global load balancing with SSL offloading',
      'Integrates with Google Cloud CDN for edge caching and Cloud Armor for DDoS protection',
      'Supports traffic splitting for canary deployments and URL-based routing for microservices',
    ],
    tradeoffs: [
      'Vendor lock-in — deeply integrated with GCP networking (VPCs, backend services, NEGs)',
      'Global LB is powerful but the configuration model (forwarding rules, backend services, health checks) is complex',
      'Premium tier networking required for global anycast — standard tier is regional only',
    ],
  },
]
