import axios from 'axios'
import { padRight, removeHexPrefix, payloadId, hexToUtf8 } from './utilities'
import { IMethod } from './types'

function parseSignature (signature: string) {
  let name: string = ''

  const nameMatches = signature.match(/\w+(?=\()/)

  if (nameMatches && nameMatches.length) {
    name = nameMatches[0]
  }

  name =
    name.charAt(0).toUpperCase() +
    name
      .slice(1)
      .split(/(?=[A-Z])/)
      .join(' ')

  let args: string[] = []

  const argsMatches = signature.match(/\(.+\)/)

  if (argsMatches && argsMatches.length) {
    args = argsMatches[0].slice(1, -1).split(',')
  }

  const result = {
    name,
    args: args.map((arg: string) => ({ type: arg }))
  }

  return result
}

const registryMap = {
  '1': '0x44691B39d1a75dC4E0A0346CBB15E310e6ED1E86'
}

export const lookupMethod = async (
  methodHash: string
): Promise<IMethod | null> => {
  let result = null

  const chainId = 1
  const registryAddress = registryMap[chainId]

  const rpcUrl = 'https://mainnet.infura.io'

  const functionHash = '0xb46bcdaa'
  const dataString = functionHash + padRight(removeHexPrefix(methodHash), 64)

  const response = await axios.post(rpcUrl, {
    jsonrpc: '2.0',
    id: payloadId(),
    method: 'eth_call',
    params: [
      {
        to: registryAddress,
        data: dataString
      },
      'latest'
    ]
  })

  if (response.data && response.data.result) {
    const signature = hexToUtf8(response.data.result)
      .trimLeft()
      .trimRight()
    if (signature) {
      const parsed = parseSignature(signature)

      result = { signature, ...parsed }
    }
  }
  return result
}