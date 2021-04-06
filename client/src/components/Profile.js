import ProfilePicture from "./ProfilePicture";
import BioEditor from "./BioEditor";

export default function Profile({ firstname, lastname, profile_url, onClick }) {
    return (
        <section className="profile">
            <ProfilePicture
                firstname={firstname}
                lastname={lastname}
                profile_url={profile_url}
                onClick={onClick}
            />
            <div className="profile-details">
                <p>USER NAME</p>
                <BioEditor />
            </div>
        </section>
    );
}
