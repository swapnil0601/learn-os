import { QuizQuestion } from '@/types'

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    scenario:
      'You need to handle 1 million concurrent write operations per second for a social media feed. Which database pattern would you primarily choose?',
    options: [
      { label: 'Single relational database with indexing', value: 'a' },
      { label: 'Sharded NoSQL database with eventual consistency', value: 'b' },
      { label: 'Read replicas with a single write master', value: 'c' },
      { label: 'In-memory cache as the primary data store', value: 'd' },
    ],
    correctAnswer: 'b',
    explanation:
      'At 1M writes/sec, you need horizontal write scaling. Sharded NoSQL (e.g., Cassandra, DynamoDB) distributes writes across nodes. A single master bottlenecks writes, read replicas only scale reads, and in-memory caches lack durability.',
    relatedConcepts: ['sharding', 'cap-theorem', 'db-replication'],
  },
  {
    id: 'q2',
    scenario:
      'Your e-commerce platform experiences a 10x traffic spike during flash sales, but you cannot afford to drop any orders. What combination of patterns helps most?',
    options: [
      { label: 'CDN + Database Indexing', value: 'a' },
      { label: 'Message Queue + Auto-scaling Load Balancer', value: 'b' },
      { label: 'Database Sharding + Caching', value: 'c' },
      { label: 'API Gateway + Rate Limiting', value: 'd' },
    ],
    correctAnswer: 'b',
    explanation:
      'Message queues buffer the spike so orders are never lost (processed asynchronously), while auto-scaling load balancers distribute traffic across dynamically added servers. Rate limiting would reject orders, and CDN/indexing dont address order processing.',
    relatedConcepts: ['message-queues', 'load-balancing'],
  },
  {
    id: 'q3',
    scenario:
      'You are building a global real-time collaborative document editor (like Google Docs). Users in Tokyo and New York must see each others changes within 200ms. Which consistency model is most appropriate?',
    options: [
      { label: 'Strong consistency with a single leader in US-East', value: 'a' },
      { label: 'Eventual consistency with conflict-free replicated data types (CRDTs)', value: 'b' },
      { label: 'Two-phase commit across all regions', value: 'c' },
      { label: 'Read-your-writes consistency with async replication', value: 'd' },
    ],
    correctAnswer: 'b',
    explanation:
      'CRDTs allow concurrent edits at different locations with guaranteed convergence — no coordination needed. Strong consistency from a single leader adds 150ms+ RTT for Tokyo users. 2PC is too slow for real-time. Read-your-writes doesnt handle conflicts between users.',
    relatedConcepts: ['cap-theorem', 'db-replication'],
  },
  {
    id: 'q4',
    scenario:
      'Your API serves 50,000 requests/second but 80% of requests fetch the same 100 product pages. Response time is 500ms. How do you reduce it to under 50ms for those pages?',
    options: [
      { label: 'Add database read replicas', value: 'a' },
      { label: 'Implement application-level caching with Redis + CDN', value: 'b' },
      { label: 'Shard the database by product category', value: 'c' },
      { label: 'Switch to a faster programming language', value: 'd' },
    ],
    correctAnswer: 'b',
    explanation:
      'Since 80% of traffic hits the same 100 pages, caching is the perfect fit. Redis serves from memory (~1ms), CDN serves from edge (~10-30ms). Read replicas still hit disk (~50-100ms). Sharding doesnt help with hot data. Language changes yield marginal gains.',
    relatedConcepts: ['caching', 'cdn'],
  },
  {
    id: 'q5',
    scenario:
      'A malicious user is sending 100,000 requests per minute to your authentication endpoint, attempting to brute-force passwords. What is the most effective immediate defense?',
    options: [
      { label: 'Add more servers behind a load balancer', value: 'a' },
      { label: 'Implement rate limiting with a sliding window counter per IP', value: 'b' },
      { label: 'Cache authentication responses', value: 'c' },
      { label: 'Move to a microservices architecture', value: 'd' },
    ],
    correctAnswer: 'b',
    explanation:
      'Rate limiting per IP with sliding window precisely throttles abusive clients while allowing legitimate traffic. More servers just absorb cost without stopping the attack. Caching auth responses is a security risk. Microservices dont address the problem.',
    relatedConcepts: ['rate-limiting', 'api-gateway'],
  },
  {
    id: 'q6',
    scenario:
      'You are migrating a monolithic e-commerce app to microservices. The checkout process currently involves inventory check, payment, and order creation in one database transaction. How do you maintain data consistency across services?',
    options: [
      { label: 'Use a distributed two-phase commit across all three services', value: 'a' },
      { label: 'Implement the Saga pattern with compensating transactions', value: 'b' },
      { label: 'Keep a shared database for all three services', value: 'c' },
      { label: 'Use synchronous REST calls between services', value: 'd' },
    ],
    correctAnswer: 'b',
    explanation:
      'The Saga pattern orchestrates a sequence of local transactions with compensating actions for failures (e.g., refund payment if order creation fails). 2PC doesnt scale well. A shared database defeats microservices purpose. Synchronous calls create tight coupling.',
    relatedConcepts: ['microservices', 'message-queues'],
  },
  {
    id: 'q7',
    scenario:
      'Your system uses consistent hashing to distribute cache keys across 5 nodes. Node 3 crashes. What happens to the data it held?',
    options: [
      { label: 'All data across all nodes must be redistributed', value: 'a' },
      { label: 'Only Node 3s data is redistributed to its successor on the ring', value: 'b' },
      { label: 'The system goes down until Node 3 recovers', value: 'c' },
      { label: 'Data is lost permanently and must be rebuilt from the database', value: 'd' },
    ],
    correctAnswer: 'b',
    explanation:
      'Consistent hashing ensures that only the keys belonging to the failed node need to be remapped — they are picked up by the next node on the ring. Other nodes keys remain unchanged. This is the key advantage over modulo-based hashing where all keys would need redistribution.',
    relatedConcepts: ['consistent-hashing', 'caching'],
  },
  {
    id: 'q8',
    scenario:
      'Your application serves users in 30 countries. Static assets (images, JS, CSS) take 3-5 seconds to load for users far from your US-based origin server. What is the most impactful solution?',
    options: [
      { label: 'Optimize images and minify JavaScript', value: 'a' },
      { label: 'Deploy a CDN with edge locations in those countries', value: 'b' },
      { label: 'Add database indexes to speed up page generation', value: 'c' },
      { label: 'Implement server-side caching with Redis', value: 'd' },
    ],
    correctAnswer: 'b',
    explanation:
      'CDN edge locations physically closer to users dramatically reduce latency for static assets (from 3-5s to ~50-200ms). Image optimization helps marginally. Database indexes dont affect static asset delivery. Server-side caching doesnt help with network latency.',
    relatedConcepts: ['cdn', 'caching'],
  },
  {
    id: 'q9',
    scenario:
      'You have a read-heavy application (95% reads, 5% writes) on a single database that is reaching its connection limit. The data must always be consistent for reads. What is your first scaling step?',
    options: [
      { label: 'Shard the database horizontally', value: 'a' },
      { label: 'Add synchronous read replicas with leader-follower replication', value: 'b' },
      { label: 'Switch to an eventually consistent NoSQL database', value: 'c' },
      { label: 'Implement write-behind caching', value: 'd' },
    ],
    correctAnswer: 'b',
    explanation:
      'Synchronous read replicas scale read capacity while maintaining strong consistency (reads see latest writes). Sharding is overkill for a read-heavy workload. NoSQL with eventual consistency violates the consistency requirement. Write-behind caching risks stale reads.',
    relatedConcepts: ['db-replication', 'cap-theorem', 'sharding'],
  },
  {
    id: 'q10',
    scenario:
      'Your mobile app makes 15 different API calls on the home screen to various microservices. Users complain about slow load times and high data usage. What pattern best addresses this?',
    options: [
      { label: 'Add caching headers to each API response', value: 'a' },
      { label: 'Implement an API Gateway with request aggregation (BFF pattern)', value: 'b' },
      { label: 'Convert all services to use gRPC', value: 'c' },
      { label: 'Add a CDN in front of all API endpoints', value: 'd' },
    ],
    correctAnswer: 'b',
    explanation:
      'An API Gateway with BFF pattern aggregates 15 calls into 1, reducing round trips and data transfer. The gateway fetches from services server-side (fast datacenter network) and returns a single optimized response. Caching headers help but dont reduce round trips. gRPC is more efficient per-call but doesnt solve the chattiness.',
    relatedConcepts: ['api-gateway', 'microservices', 'load-balancing'],
  },
  {
    id: 'q11',
    scenario:
      'Your database query "SELECT * FROM orders WHERE user_id = ? AND status = ? ORDER BY created_at DESC" is slow. The orders table has 500M rows. What index would best optimize this query?',
    options: [
      { label: 'Index on (user_id)', value: 'a' },
      { label: 'Index on (created_at)', value: 'b' },
      { label: 'Composite index on (user_id, status, created_at)', value: 'c' },
      { label: 'Separate indexes on user_id, status, and created_at', value: 'd' },
    ],
    correctAnswer: 'c',
    explanation:
      'A composite index on (user_id, status, created_at) covers all WHERE clause columns and the ORDER BY in the exact order needed. The database can do an index-only scan. Separate indexes force the optimizer to choose one. Index on just user_id still requires filtering and sorting.',
    relatedConcepts: ['indexing', 'sharding'],
  },
  {
    id: 'q12',
    scenario:
      'You are designing a notification system that must send 10M push notifications within 5 minutes when a breaking news event occurs. The downstream push notification service rate-limits you to 10,000 requests/second. What architecture handles this?',
    options: [
      { label: 'Direct synchronous calls to the push service from the web server', value: 'a' },
      { label: 'Message queue with multiple consumer workers + rate-limited producer', value: 'b' },
      { label: 'Batch all notifications into a single API call', value: 'c' },
      { label: 'Cache the notifications and send them when traffic is low', value: 'd' },
    ],
    correctAnswer: 'b',
    explanation:
      'A message queue decouples notification creation from delivery. Multiple consumer workers process messages in parallel while respecting the 10K/sec rate limit. At 10K/sec, 10M notifications complete in ~17 minutes — you may need to negotiate higher limits or use batching within the queue. Synchronous calls would block the web server. Delaying defeats the "breaking news" purpose.',
    relatedConcepts: ['message-queues', 'rate-limiting', 'load-balancing'],
  },
]
