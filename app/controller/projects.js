/**
 * 项目构造相关
 */
const shell = require('shelljs')
const Controller = require('egg').Controller
const projects = require('../../projects.json')

class ProjectsController extends Controller {

  async deploy(){
    const { ctx } = this
    const code =ctx.params.code
    const proj = projects[code]
    if(typeof proj === 'undefined'){
      ctx.type = 'text/json'
      ctx.status = 400
      ctx.body = { code: 400, msg: '项目不存在：'+ code }
      return
    }
    console.log(proj)
    const res = await ctx.service.deploy.index(proj)
    ctx.type = 'text/json'
    if(res === 0){
      ctx.status = 200
      ctx.body = { code: 0 }
    }else{
      ctx.status = 400
      ctx.body = { code: res }
    }

  }

}

module.exports = ProjectsController
