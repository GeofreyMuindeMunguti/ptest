
const CONSUL_ID = require('uuid').v4();
const env = require('dotenv').config();
const request = require('request');

let options = {
    host:process.env.CONSUL_HOST,
    port: process.env.CONSUL_PORT
}

const consul = require('consul')(options);

let details = {
    name: process.env.SERVICE_NAME,
    address: process.env.HOST,
    port: parseInt(process.env.PORT),
    id: CONSUL_ID,
    check: {
      ttl: '10s',
      deregister_critical_service_after: '10s'
    }
};

let load_balancer_record = [];

consul.agent.service.register(details, err => {
// schedule heartbeat
console.log("Registered");
console.log(err)
});
setInterval(() => {
consul.agent.check.pass({id:`service:${CONSUL_ID}`}, err => {
    if (err) throw new Error(err);
});
}, 10 * 1000);

process.on('SIGINT', () => {
console.log('SIGINT. De-Registering...');
let details = {id: CONSUL_ID};

consul.agent.service.deregister(details, (err) => {
    console.log('de-registered.', err);
    process.exit();
});
});

function getServiceDefinitions(service_name, callback){
    consul.catalog.service.nodes(service_name, function(err, result) {
        if (err) throw err;
        callback(result)
    });
}

function round_robin_loadBalancer(service_definition, callback){
    if (load_balancer_record.length < 1) {
        load_balancer_record.push({
            service_name: service_definition.name,
            service_number: service_definition.length,
            last_call: 0
        })
        callback(0);
    }
    if (load_balancer_record.length > 0) {
        load_balancer_record.forEach(service=>{
            if (service.service_name == service_definition.name){
                if(service.service_number > 1){
                    if (service.last_call + 2 <= service.service_number){
                        current_call = service.last_call + 1
                        service.last_call = current_call;
                        service.service_number = service_definition.length
                        callback(service.last_call)
                    }else{
                        service.last_call = 0;
                        service.service_number = service_definition.length
                        callback(service.last_call);
                    }
                }else{
                    service.service_number = service_definition.length
                    callback(service.last_call)
                }
            }
        })
    }
}

async function service_call(service_call_body, callback) {
    let response;
    getServiceDefinitions(service_call_body.service_name, async function(result){
        let service_definition= {
            // address: result[0].ServiceAddress,
            // port: result[0].ServicePort,
            name: result[0].ServiceName,
            length: result.length
        }
        round_robin_loadBalancer(service_definition, function(service_index){
            response = {address: result[service_index].ServiceAddress,
                        port: result[service_index].ServicePort
            }
        })

        const uri = (response.port !=null) ? 'http://'+response.address+':'+response.port : response.address
        const url = uri+service_call_body.endpoint
        const request_structure = {url:url, method: service_call_body.method, form: service_call_body.payload}

        requestcall(request_structure, function(onResponse){
            callback(onResponse)
        })
    });
}

function requestcall(options, callback){
    request(options, (err, res, body)=>{
        if( !err) {
            callback(body)
        }else{
            throw Error(err)
        }
    });
}

module.exports = { getServiceDefinitions, round_robin_loadBalancer, service_call }