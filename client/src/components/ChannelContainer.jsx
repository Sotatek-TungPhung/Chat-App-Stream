import React from 'react';
import { Channel ,  Attachment, useMessageContext} from 'stream-chat-react';
import { MML } from 'mml-react';

import { ChannelInner, CreateChannel, EditChannel } from './';

const ChannelContainer = ({ isCreating, setIsCreating, isEditing, setIsEditing, createType }) => {
    if(isCreating) {
        return (
            <div className="channel__container">
                <CreateChannel createType={createType} setIsCreating={setIsCreating} />
            </div>
        )
    }

    if(isEditing) {
        return (
            <div className="channel__container">
                <EditChannel setIsEditing={setIsEditing} />
            </div> 
        )
    }

    const EmptyState = () => (
        <div className="channel-empty__container">
            <p className="channel-empty__first">This is the beginning of your chat history.</p>
            <p className="channel-empty__second">Send messages, attachments, links, emojis, and more!</p>
        </div>
    )

    const CustomMessage = () => {
        const { message } = useMessageContext();
        console.log(JSON.parse(JSON.stringify(message)));
        return (
          <div>
              { message?.attachments[0]?.type === 'mml' && <MML source={message.attachments[0].mml} />}
            {message.attachments && <Attachment attachments={message.attachments} />}
          </div>
        );
      };

    return (
        <div className=" channel__container">
            <Channel
                EmptyStateIndicator={EmptyState}
                Message={CustomMessage}
            >
                <ChannelInner setIsEditing={setIsEditing} />
            </Channel>
        </div>
    );
}

export default ChannelContainer;
