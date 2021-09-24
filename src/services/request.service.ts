import axios from 'axios'
import { IRequest } from '../interfaces/request.interface';
import colors from 'colors'

export class StressAPI {

    private static concurrency = 0
    private static totalTime = 0
    private static times = []
    private static successfulRequests = 0
    private static failedRequests = 0
    private static axiosRequests = []
    private static totalRequests = 0

    static async start(opts: IRequest) {
        this.concurrency = opts.concurrency
   
        let axiosOptions = {
            url: opts.url,
            method: opts.method,
            headers: opts.headers,
            data: opts.body,
            timeout: opts.timeout
        }

        for(let i = 0; i < this.concurrency; i++) {
            this.axiosRequests.push(axiosOptions)
        }

        for(let count = 0; count < opts.maxRequests; count ++) {
            this.totalRequests += 1
            await this.printer(this.axiosRequests, this.totalRequests)
        } 

        this.report(this.totalRequests)
    }

    private static async printer(requests: any[], totalRequests: number) {
        let startTime = new Date().getTime()

        const promisses = requests.map(async (request) => {
            try {
                const response = await axios(request)
                console.log("")
                console.log(colors.yellow(`Request Index: ${totalRequests}`))
                console.log(colors.yellow(`Request ended in: ${((new Date().getTime() - startTime)/1000).toFixed(2)}s`))
                console.log(colors.green(`Status Code: `) + colors.bgGreen(`${response.status}`))
                console.log(colors.green(`Status Text: `) + colors.bgGreen(`${response.statusText} `))
                console.log("")
                console.log('--------------------------------------------------')
                this.totalTime += parseFloat(((new Date().getTime() - startTime)/1000).toFixed(2))
                this.times.push(parseFloat(((new Date().getTime() - startTime)/1000).toFixed(2)))
                this.successfulRequests += 1
            } catch (error) {
                console.log("")
                console.log(colors.yellow(`Request Index: ${totalRequests}`))
                console.log(colors.yellow(`Request ended in: ${((new Date().getTime() - startTime)/1000).toFixed(1)}s`))
                console.log(colors.red(`Status Code: `) + colors.bgRed(`FAILED`))
                console.log(colors.red(`Status Text: `) + colors.bgRed(`FAILED`))
                console.log("")
                console.log('--------------------------------------------------')
                this.totalTime += parseFloat(((new Date().getTime() - startTime)/1000).toFixed(2))
                this.times.push(parseFloat(((new Date().getTime() - startTime)/1000).toFixed(2)))
                this.failedRequests += 1
            }
        })

        await Promise.all(promisses)
    }

    private static report(totalRequests: number) {
        console.log("")
        console.log(colors.bgMagenta("FINAL REPORT"))
        console.log(`TOTAL REQUESTS: ${totalRequests}`)
        console.log(`SIMULTANEOUS REQUESTS: ${this.concurrency}`)
        console.log(`SUCCESSFUL: ${this.successfulRequests}`)
        console.log(`FAILED: ${this.failedRequests}`)
        console.log(`TOTAL TIME: ${(this.totalTime).toFixed(2)}s`)
        console.log(`LONGER TIME: ${Math.max(...this.times)}s`)
        console.log(`SHORTER TIME: ${Math.min(...this.times)}s`)
        console.log(`TIME AVERAGE: ${(this.totalTime/this.times.length).toFixed(2)}s`)
        console.log("")
        console.log(`--------------------------------------------------`)
    }
}