import { post } from 'wumpfetch';

export type DiscordEmbed = {
    title?: string
    color?: string
    description?: string
    author?: {
      name?: string
      url?: string
      icon_url?: string
    }
    url?: string
    fields?: {
      name?: string
      value?: string
      inline?: boolean
    }[]
    image?: {
      url: string
    }
    thumbnail?: {
      url: string
    }
    footer?: {
      text?: string
      icon_url?: string
    }
    timestamp?: string
  }

export default class Webhook {
    constructor(public url: string) {}
    async send(content: string, embed?: DiscordEmbed) {
        if (!content) return Promise.reject(new Error('No content was found to send.'));
        const embeds = embed? [embed]: undefined;
        await post(this.url, {
            data: {
                content,
                embeds
            }
        }).send();
    }
}