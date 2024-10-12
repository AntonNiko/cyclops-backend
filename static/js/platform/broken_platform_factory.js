class BrokenPlatformFactory {

    /**
     * Initializes the broken platform factory used to render a broken platform with the specified data.
     *
     * @param scene: The game scene that is used for platform creation
     * @param platform_data: The type and coordinate of a single boost platform used to render on the scene
     * @returns {*}: If rendered successfully, returns the sprite object of the newly created platform.
     */
    constructor(scene, platform_data) {
        let x = platform_data['x'];
        let y = platform_data['y'];
        let strength = platform_data['strength'];

        // Renders the platform on the scene at the specified coordinates, and a strength for the platform's durability.
        return this.createBrokenPlatform(scene, x, y, strength);
    }

    /**
     * Renders the broken platform from the provided scene and platform data on the scene, and returns the newly
     * created sprite.
     *
     * @param scene: The game scene that is used for platform creation
     * @param pos_x: The X coordinate at which the boost platform should be created at.
     * @param pos_y: The Y coordinate at which the boost platform should be created at.
     * @param strength: The broken platform's durability; the higher the durability the longer it is present in the scene.
     */
    createBrokenPlatform(scene, pos_x, pos_y, strength) {
        return scene.physics.add.staticImage(pos_x, pos_y, "broken-platform").setScale(2).setData({'strength': strength, 'type': 'broken'});
    }
}
