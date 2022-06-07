import http from 'k6/http'
import { sleep, check } from 'k6'
import { Rate, Trend } from 'k6/metrics'

const lowerThan5mRate = new Rate('lower_than_5m')
const durationInMicroSecond = new Trend('duration_in_microsecond')

// This BASE_URL won't work if you' using Docker.
// You'll need to know the IP address of the host.
// Then replace the localhost with the IP address.
const BASE_URL = 'http://localhost:8080'

export const options = {
    vus: 1,
    duration: '30m',
    summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(95)', 'p(99)', 'count'],
    // setupTimeout: "30m",
}

export function setup() {
    const authParams = {
        headers: { 'Content-Type': 'application/json' },
    }
    //
    // const authPayload = {
    //     email: 'user1@example.com',
    //     password: 'password',
    //     nickname: 'user1'
    // }
    //
    // http.post(`${BASE_URL}/users`, JSON.stringify(authPayload), authParams)

    const loginPayload = {
        // email: 'user1@example.com',
        // password: 'password',
        email: 'steven@gmail.com',
        password: 'password',
    }

    let token = http.post(`${BASE_URL}/login`, JSON.stringify(loginPayload), authParams)

    let c = token.body.replace('"', "").replace('"', "").replace("\n", "")

    const params = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${c.toString()}`
        }
    }

    // let activateBalanceFirst = http.post(`${BASE_URL}/mybalances/activate`, JSON.stringify({}), params)

    return {
        params: params,
    }
}

export default function(data) {

    // const res = http.get(`${BASE_URL}/mybalances/check`, data.params)

    let transPayload = {
        "added_balance": 30000.0
    }
    // {
    //     "author_id": 1,
    //     "product_id": 1,
    //     "qty": 2,
    //     "disc_name": "DISCOUNT30"
    // }

    // console.log(transPayload)
    // console.log(data.params.toString())

    const res = http.post(`${BASE_URL}/mybalances/topup`, JSON.stringify(transPayload), data.params)

    // console.log("Ea")
    // console.log(res.body)

    check(res, {
        'is status 200': (r) => r.status === 201
        // 'duration below 2s': r => r.timings.duration < 2000
    })

    lowerThan5mRate.add(res.timings.duration < 5000)
    durationInMicroSecond.add(res.timings.duration * 1000 )



    // sleep(1)
}

export function teardown(data) {
    // const params = {
    //     headers: {
    //         Authorization: `Bearer ${data.token}`
    //     }
    // }
    //
    // // To clear/truncate the injected table we need token
    // http.get(`${BASE_URL}/users/clear`, params)
}