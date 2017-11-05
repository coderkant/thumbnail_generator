  const Prometheus = require('prom-client')  
  const monitor= (req, res) => {
    res.end(Prometheus.register.metrics())
  }
  
  const PrometheusMetrics = {
      requestCounter: new Prometheus.Counter({'name':'throughput', 'help':'The number of requests served'}),
      DefaultMetrics: Prometheus.collectDefaultMetrics({ timeout: 5000 })
    }
    
  const countRequests = (req, res, next) => {
      PrometheusMetrics.requestCounter.inc()
      next()
    }
  
    module.exports= {
        "monitor":monitor,
        "countRequests":countRequests
    }