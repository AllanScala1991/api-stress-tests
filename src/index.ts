import { IRequest } from "./interfaces/request.interface"
import { StressAPI } from "./services/request.service"


/* StressAPI.start({
    url: "https://httpbin.org/get",
    method: 'GET',
    maxRequests: 10,
    concurrency: 10,
    timeout: 1000
})  */

export default class ApiStress {

    constructor (
        private opts: IRequest,
        private readonly stressTest = StressAPI
    ){}

    start(): void {
        this.stressTest.start(this.opts)
    }
}

