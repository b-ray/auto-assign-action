import _ from 'lodash'
import * as github from '@actions/github'
import * as yaml from 'js-yaml'
import { Config } from './handler'

export async function fetchConfigurationFile(client: github.GitHub, options) {
  const { owner, repo, path, ref } = options
  const result = await client.repos.getContents({
    owner,
    repo,
    path,
    ref,
  })

  const data: any = result.data

  if (!data.content) {
    throw new Error('the configuration file is not found')
  }

  const configString = Buffer.from(data.content, 'base64').toString()
  const config = yaml.safeLoad(configString)

  return config
}

export function chooseLabelForReviewer(
  reviewer: string,
  config: Config
): string {
  const { reviewerToLabelMap } = config

  return reviewerToLabelMap[reviewer]
}

export function chooseLabelForTargetBranch(
  targetBranch: string,
  config: Config
): string {
  const { branchesToLabelMap } = config

  let key = Object.keys(branchesToLabelMap).find(e =>
    e.startsWith(targetBranch)
  )
  if (key) {
    return branchesToLabelMap[key]
  }
  return ''
}
