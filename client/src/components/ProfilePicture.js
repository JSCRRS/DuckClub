export default function ProfilePicture({ ...props }) {
    const defaultImageUrl = "https://via.placeholder.com/150";

    /*     console.log("[ProfilePicture] props:", props);
     */
    return (
        <section className="profilePic">
            <img
                src={props.profile_url || defaultImageUrl}
                alt={(props.firstname, props.lastname)}
                onClick={props.onClick}
            />
        </section>
    );
}
