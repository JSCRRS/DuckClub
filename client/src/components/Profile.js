import ProfilePicture from "./ProfilePicture";
import BioEditor from "./BioEditor";

export default function Profile({
    firstname,
    lastname,
    profile_url,
    onClick,
    bio,
    onBioSave,
}) {
    return (
        <section className="userProfileCard profile ">
            <ProfilePicture
                firstname={firstname}
                lastname={lastname}
                profile_url={profile_url}
                onClick={onClick}
            />
            <div className="profile-details">
                <h2>
                    {firstname} {lastname}
                </h2>
                <BioEditor bio={bio} onBioSave={onBioSave} />
            </div>
        </section>
    );
}
