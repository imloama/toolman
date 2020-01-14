'use strict'
const shell = require('shelljs')
const { Service } = require('egg')

class DeployService extends Service {
  index (proj) {
    shell.cd(proj.disk)
    shell.rm("-rf", proj.code)
    let branch = ''
    if(proj.source.branch){
      branch = '-b ' + proj.source.branch
    }
    shell.cd(proj.disk)
    let scripts = `git clone ${branch} ${proj.source.repo} ${proj.code}`
    console.log(`scripts =  ${scripts}`)
    let res = shell.exec(scripts).code
    if(res !== 0){
      shell.exit(1)
      return -1
    }
    shell.cd(proj.code)
    let bs = proj.scripts.build
    if(bs){
      res = shell.exec(bs).code
      if(res!==0)return -2//编译失败
    }
    let cp = proj.scripts.copy
    if(cp){
      res = shell.exec(cp).code
      if(res!==0)return -3//复制失败
    }
    shell.cd(proj.target)
    let stop = proj.scripts.stop
    res = shell.exec(stop).code
    if(res!==0)return -4
    let start = proj.scripts.start
    if(shell.exec(start).code!==0)return -5
    shell.echo(`部署${proj.code}成功！`)
    return 0
  }
}

module.exports = DeployService
