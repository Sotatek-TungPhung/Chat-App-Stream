import React, {useState} from 'react';
import { Channel ,  Attachment, useMessageContext, MessageTeam} from 'stream-chat-react';
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

    // const test = ( action = 'log') => {
    //     switch(action) {
    //         case 'log':
    //             setMmlSource(`<mml type="card">
    //             <scheduler 
    //               name="appointment" 
    //               duration="30" 
    //               timeInterval="15"
    //               selected="2020-11-16T10:30:00.000Z"
    //             />
    //             <button name="action" value="reserve">Reserve</button>
    //           </mml>`);
    //             break;
    //         case 'edit':
    //             console.log('case edit');
    //             break;
    //         default:
    //             console.log('default');
    //     }
    // }

    const CustomMessage = (a, i) => {
        const { message } = useMessageContext();
        console.log(message);
        if (!message.attachments.length) {
            return <MessageTeam key={i} {...message} />
        }
        let mmlSource = ''
        switch(message.attachments[0].action) {
            case 'log':
                mmlSource = `<mml type="card">
                <scheduler 
                  name="appointment" 
                  duration="30" 
                  timeInterval="15"
                  selected="2020-11-16T10:30:00.000Z"
                />
                <button name="action" value="reserve">Reserve</button>
              </mml>`;
                break;
            case 'edit':
                console.log('case edit');
                break;
            default:
                console.log('default');
        }

        return (
          <div>
            {message?.attachments[0]?.type === 'mml' && <MML source={mmlSource} />}
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
