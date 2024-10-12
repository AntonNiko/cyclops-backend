/**
 * Class which is responsible for rendering the platforms on a specific scene with data that includes platform types
 * and coordinates.
 */
class PlatformManager {

    /**
     * Initializes the platform manager and immediately renders the platforms on the provided scene as specified by
     * the platform data.
     *
     * @param scene: The game scene that is used for platform creation
     * @param platforms_data: The type and coordinates of the platforms used to render the scene
     */
    constructor(scene, platforms_data) {
        this.scene = scene;
        this.scene.platforms = this.scene.physics.add.staticGroup();
        this.plats = [];

        // Render platforms and appending the newly created sprite to an array.
        platforms_data.forEach(element => this.plats.push(this.createPlatform(scene, element)));
    }

    /**
     * Returns the list of all the rendered platforms in the provided scene.
     *
     * @returns {[]}: A list of sprites associated with the platforms rendered on the scene provided at initialization.
     */
    getPlatforms() {
        return this.plats;
    }

    /**
     * Renders the single platform specified on the scene provided based on the type of platform specified.
     *
     * @param scene: The game scene that is used for platform creation
     * @param platform_data: The type and coordinate of a single platform used to render the scene
     * @returns {*}: If rendered successfully, returns the sprite object of the newly rendered platform
     */
    createPlatform(scene, platform_data) {
        switch(platform_data['type']) {
            case 'natural':
               return new NaturalPlatformFactory(scene, platform_data);
            case 'boost':
                return new BoostPlatformFactory(scene, platform_data);
            case 'broken':
                return new BrokenPlatformFactory(scene, platform_data);
            default:
                break;
        }
    }
}