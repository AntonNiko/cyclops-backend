class BoostPlatformFactory {

    /**
     * Initializes the factory class that renders a boost platform on the scene provided.
     *
     * @param scene: The game scene that is used for platform creation
     * @param platform_data: The type and coordinate of a single boost platform used to render on the scene
     * @returns {*}: If rendered successfully, returns the sprite object of the newly created platform
     */
    constructor(scene, platform_data) {
        let x = platform_data['x'];
        let y = platform_data['y'];
        this.scene = scene;

        // Render the platform's animation for boosting functionality.
        this.scene.anims.create({
            key: 'boosty',
            frames: this.scene.anims.generateFrameNumbers('boost-platform', { start: 1, end: 4 }),
            frameRate: 10,
            repeat: 1
        });

        // Invoke platform rendering
        return this.createBoostPlatform(scene, x, y);
    }

    /**
     * Renders the boost platform from the provided scene and platform data on the scene, and returns the newly
     * created sprite.
     *
     * @param scene: The game scene that is used for platform creation
     * @param pos_x: The X coordinate at which the boost platform should be created at.
     * @param pos_y: The Y coordinate at which the boost platform should be created at.
     */
    createBoostPlatform(scene, pos_x, pos_y) {
        return scene.physics.add.staticSprite(pos_x, pos_y, "boost-platform").setScale(3).setData({'type': 'boost'});
    }
}
