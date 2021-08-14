import * as github from '@actions/github'
import * as core from '@actions/core'
import { Context } from '@actions/github/lib/context'

export class PullRequest {
  private client: github.GitHub
  private context: Context

  constructor(client: github.GitHub, context: Context) {
    this.client = client
    this.context = context
  }

  async addReviewers(reviewers: string[]): Promise<void> {
    const { owner, repo, number: pull_number } = this.context.issue
    const result = await this.client.pulls.createReviewRequest({
      owner,
      repo,
      pull_number,
      reviewers,
    })
    core.debug(JSON.stringify(result))
  }

  async addAssignees(assignees: string[]): Promise<void> {
    const { owner, repo, number: issue_number } = this.context.issue
    const result = await this.client.issues.addAssignees({
      owner,
      repo,
      issue_number,
      assignees,
    })
    core.debug(JSON.stringify(result))
  }

  async addLabels(labels: string[]): Promise<void> {
    const { owner, repo, number: issue_number } = this.context.issue
    const result = await this.client.issues.addLabels({
      owner,
      repo,
      issue_number,
      labels,
    })
    core.debug(JSON.stringify(result))
  }

  hasAnyLabel(labels: string[]): boolean {
    if (!this.context.payload.pull_request) {
      return false
    }
    const { labels: pullRequestLabels = [] } = this.context.payload.pull_request
    return pullRequestLabels.some((label: { name: string }) =>
      labels.includes(label.name)
    )
  }

  getReviewers(): string[] {
    if (!this.context.payload.pull_request) {
      return []
    }
    const {
      requested_reviewers: pullRequestReviewers = [],
    } = this.context.payload.pull_request
    return pullRequestReviewers.map(
      (reviewer: { login: string }) => reviewer.login
    )
  }

  getAssignees(): string[] {
    if (!this.context.payload.pull_request) {
      return []
    }
    const {
      assignees: pullRequestAssignees = [],
    } = this.context.payload.pull_request
    return pullRequestAssignees.map(
      (assignee: { login: string }) => assignee.login
    )
  }

  getTeamAssignees(): string[] {
    if (!this.context.payload.pull_request) {
      return []
    }
    const {
      requested_teams: pullRequestAssignees = [],
    } = this.context.payload.pull_request
    return pullRequestAssignees.map(
      (assignee: { name: string }) => assignee.name
    )
  }

  getTargetBranch(): string {
    if (!this.context.payload.pull_request) {
      return ''
    }
    const { base: base } = this.context.payload.pull_request
    return base.ref
  }
}
