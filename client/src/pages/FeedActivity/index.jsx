import React from 'react';
import {
    StreamApp,
    NotificationDropdown,
    FlatFeed,
    LikeButton,
    Activity,
    CommentList,
    CommentField,
    StatusUpdateForm,
} from 'react-activity-feed';
import 'react-activity-feed/dist/index.css';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const authToken = cookies.get("token");
const APIKEY = 'bwd488bykyhp';
const APPID = '1184817';

const FeedActivity = () => {

    return (
        <StreamApp apiKey={APIKEY} appId={APPID} token={authToken}>
            <NotificationDropdown notify />
            <StatusUpdateForm />
            <FlatFeed
                options={{ reactions: { recent: true } }}
                notify
                Activity={(props) => (
                    <Activity
                        {...props}
                        Footer={() => (
                            <div style={{ padding: '8px 16px' }}>
                                <LikeButton {...props} />
                                <CommentField activity={props.activity} onAddReaction={props.onAddReaction} />
                                <CommentList activityId={props.activity.id} />
                            </div>
                        )}
                    />
                )}
            />
        </StreamApp>
    );
}

export default FeedActivity;

