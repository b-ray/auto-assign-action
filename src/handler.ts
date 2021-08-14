import * as core from '@actions/core'
import * as github from '@actions/github'
import { Context } from '@actions/github/lib/context'
import * as utils from './utils'
import { PullRequest } from './pull_request'

export interface Config {
  reviewerToLabelMap: { [key: string]: string }
  branchesToLabelMap: { [key: string]: string }
}

export async function handlePullRequest(
  client: github.GitHub,
  context: Context,
  config: Config
) {
  if (!context.payload.pull_request) {
    throw new Error('the webhook payload is not exist')
  }

  const { title, draft, user, number } = context.payload.pull_request

  const owner = user.login
  const pr = new PullRequest(client, context)
  var labels = new Set<string>()

  try {
    const reviewers = pr.getAssignees() // TODO: change

    for (let reviewer of reviewers) {
      const label = utils.chooseLabelForReviewer(reviewers[0], config)
      if (label) {
        labels.add(label)
      }

      core.info(`Added label to PR #${number}: ${label}`)
    }
  } catch (error) {
    core.warning(error.message)
  }

  try {
    const reviewers = pr.getTeamAssignees() // TODO: change

    for (let reviewer of reviewers) {
      const label = utils.chooseLabelForReviewer(reviewers[0], config)
      if (label) {
        labels.add(label)
      }

      core.info(`Added label to PR #${number}: ${label}`)
    }
  } catch (error) {
    core.warning(error.message)
  }

  try {
    const targetBranch = pr.getTargetBranch()

    const label = utils.chooseLabelForTargetBranch(targetBranch, config)
    if (label) {
      labels.add(label)
    }

    core.info(`Added label to PR #${number}: ${label}`)
  } catch (error) {
    core.warning(error.message)
  }

  try {
    const targetBranch = pr.getTargetBranch()

    const label = utils.chooseLabelForTargetBranch(targetBranch, config)
    if (label) {
      labels.add(label)
    }

    core.info(`Added label to PR #${number}: ${label}`)
  } catch (error) {
    core.warning(error.message)
  }

  if (labels.size > 0) {
    await pr.addLabels(Array.from(labels.values()))
  }
}
