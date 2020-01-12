'use strict'
const shell = require('shelljs')
const { Service } = require('egg')

class DeployService extends Service {
  index (proj) {
    let res = shell.cd(proj.disk)
    if(res !== 0){
      console.log('目录不存在：' + proj.disk)
      return -1;
    }
    shell.rm("-rf", proj.code)
    let branch = ''
    if(proj.source.branch){
      branch = '-b ' + proj.source.branch
    }
    res = shell.exec(`git clone ${branch} ${proj.source.repo} ${proj.code}`).code
    if(res !== 0){
      shell.exit(1)
      return -2
    }
    shell.cd(proj.code)
    let bs = proj.scripts.build
    if(bs){
      res = shell.exec(bs).code
      if(res!==0)return -3//编译失败
    }
    let cp = proj.scripts.copy
    if(cp){
      res = shell.exec(cp).code
      if(res!==0)return -4//复制失败
    }
    shell.cd(proj.target)
    let stop = proj.scripts.stop
    res = shell.exec(stop).code
    if(res!==0)return -5
    let start = proj.scripts.start
    if(shell.exec(start).code!==0)return -6
    shell.echo(`部署${proj.code}成功！`)
    return 0
  }
}

module.exports = DeployService
