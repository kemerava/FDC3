import { Given } from "@cucumber/cucumber";
import { handleResolve } from "@kite9/testing";
import { DefaultDesktopAgentChannelSelector } from "../../src/ui/DefaultDesktopAgentChannelSelector";
import { CHANNEL_SELECTOR_URL } from "../support/MockFDC3Server";
import { USER_CHANNELS } from "../support/responses/UserChannels";
import { CustomWorld } from "../world";

Given('A Channel Selector in {string} with callback piping to {string}', async function (this: CustomWorld, field: string, cb: string) {
    const cs = new DefaultDesktopAgentChannelSelector(CHANNEL_SELECTOR_URL);

    cs.setChannelChangeCallback((channelId: string) => {
        this.props[cb] = channelId
    })

    this.props[field] = cs
    await cs.connect()
})

Given('User Channels one, two and three in {string}', function (this: CustomWorld, field: string) {
    this.props[field] = USER_CHANNELS
})

Given('The channel selector sends a channel change message for channel {string}', async function (this: CustomWorld, channel: string) {
    const port = handleResolve("{document.iframes[0].messageChannels[0].port2}", this)

    port.postMessage({
        type: 'fdc3UserInterfaceSelected',
        payload: {
            selected: channel
        }
    })
})