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
        <section className="profile">
            <ProfilePicture
                firstname={firstname}
                lastname={lastname}
                profile_url={profile_url}
                onClick={onClick}
            />
            <div className="profile-details">
                <p>
                    {firstname} {lastname}
                </p>
                <BioEditor bio={bio} onBioSave={onBioSave} />
            </div>
        </section>
    );
}
