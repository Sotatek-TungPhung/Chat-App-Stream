import React from 'react';
import { Channel ,  Attachment, useMessageContext, MessageTeam} from 'stream-chat-react';
import { MML } from 'mml-react';
import Cookies from 'universal-cookie';
import { ChannelInner, CreateChannel, EditChannel } from './';
import MyCustomButton from './MyCustomButton';
const cookies = new Cookies();
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

    const test = (data, action = 'log') => {
        switch(action) {
            case 'log':
                console.log('case log:', data);
                break;
            case 'edit':
                console.log('case edit');
                break;
            default:
                console.log('default');
        }
    }
    const converters = {
        button: (tag, children) => {
          return <MyCustomButton {...tag.node.attributes} text={tag.getText()} key={tag.key} />;
        },
      };
    const renderMMl = (message) => {
       if (message.attachments && message?.attachments[0]?.type !== 'mml') return <Attachment attachments={message.attachments} />
       if (message?.attachments[0]?.show && message?.attachments[0]?.show === 'ephemeral') {
           const userId = cookies.get('userId');
           if (userId === message.user.id) return <MML onSubmit={(data) => test(data, message.attachments[0].action)} source={message.attachments[0].mml} /> 
           return;
       };
       return <MML onSubmit={(data) => test(data, message.attachments[0].action)} converters={converters} source={message.attachments[0].mml} />
    }

    const CustomMessage = (a, i) => {
        const { message } = useMessageContext();
        console.log(message);
        if (!message.attachments.length) {
            return <MessageTeam key={i} {...message} />
        }
        return (
          <div>
            {renderMMl(message)}
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
