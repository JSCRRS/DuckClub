export default function ProfilePicture({ ...props }) {
    const defaultImageUrl = "https://via.placeholder.com/150";

    console.log("[ProfilePicture] props:", props);

    return (
        <section className="profilePic">
            <img
                src={props.profile_url || defaultImageUrl}
                alt={(props.firstName, props.lastName)}
                onClick={props.onclick}
            />
        </section>
    );
}
//HIER NOCH WAS MIT DER FUNCTION "onProfilePictureClick"????
