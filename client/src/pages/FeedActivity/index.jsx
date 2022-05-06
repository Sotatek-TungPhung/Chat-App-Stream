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
import { Link } from 'react-router-dom';
import LogoutIcon from '../../assets/logout.png'

const cookies = new Cookies();
const authToken = cookies.get("token");
const APIKEY = 'bwd488bykyhp';
const APPID = '1184817';

const SideBar = ({ logout }) => (
    <div className="channel-list__sidebar">
        <div className="channel-list__sidebar__icon1">
            <div className="icon1__inner">
                <Link to="/">Chat</Link>
            </div>
        </div>
        <div className="channel-list__sidebar__icon2">
            <div className="icon1__inner" onClick={logout}>
                <img src={LogoutIcon} alt="Logout" width="30" />
            </div>
        </div>
    </div>
);

const FeedActivity = () => {

    const logout = () => {
        cookies.remove("token");
        cookies.remove('userId');
        cookies.remove('username');
        cookies.remove('fullName');
        cookies.remove('avatarURL');
        cookies.remove('hashedPassword');
        cookies.remove('phoneNumber');

        window.location.reload();
    }

    console.log({authToken});

    return (
        <div>
            <SideBar logout={logout} />
            <StreamApp apiKey={APIKEY} appId={APPID} token={authToken}>
                <NotificationDropdown notify />
                <StatusUpdateForm />
                <FlatFeed feedGroup="user"
                // options={{ reactions: { recent: true } }}
                // notify
                // Activity={(props) => (
                //     <Activity
                //         {...props}
                //         Footer={() => (
                //             <div style={{ padding: '8px 16px' }}>
                //                 <LikeButton {...props} />
                //                 <CommentField activity={props.activity} onAddReaction={props.onAddReaction} />
                //                 <CommentList activityId={props.activity.id} />
                //             </div>
                //         )}
                //     />
                // )}
                />
            </StreamApp>
        </div>
    );
}

export default FeedActivity;

