import fs from 'fs'
import path from 'path'
import { type DIO } from '../interfaces.ts'

export const getDIO =
 (dirname: string, ...args: string[]): DIO => {
   const input = fs.readFileSync(path.resolve(dirname, './input.txt'), 'utf8').split('\n')
   let test1, res1
   try {
     test1 = fs.readFileSync(path.resolve(dirname, './test1.txt'), 'utf8').split('\n')
     res1 = test1[test1.length - 1]
     test1 = test1.slice(0, test1.length - 2)
   } catch (e) {}
   let test2, res2
   try {
     test2 = fs.readFileSync(path.resolve(dirname, './test2.txt'), 'utf8').split('\n')
     res2 = test2[test2.length - 1]
     test2 = test2.slice(0, test2.length - 2)
   } catch (e) {}

   const extra: Record<string, string | string[]> = {}

   args.forEach(file => {
     let testData, resData
     try {
       testData = fs.readFileSync(path.resolve(dirname, `./${file}.txt`), 'utf8').split('\n')
       resData = testData[testData.length - 1]
       testData = testData.slice(0, testData.length - 2)
       extra[file] = testData
       extra[file.replace('test', 'res')] = resData
     } catch (e) {}
   })

   return {
     input,
     test: {
       test1,
       test2,
       res1,
       res2,
       ...extra
     },
     part1: () => '',
     part2: () => '',
     params: {}
   }
 }
