class NaturalPlatformFactory {

    /**
     * Initializes the natural platform factory used to render a natural platform with the specified data.
     *
     * @param scene: The game scene that is used for platform creation
     * @param platform_data: The type and coordinate of a natural platform used to render on the scene
     * @returns {*}: If rendered successfully, returns the sprite objects of the newly created platform.
     */
    constructor(scene, platform_data) {
        let left_x = platform_data['left_x'];
        let right_x = platform_data['right_x'];
        let y = platform_data['y'];

        this.scene = scene;
        this.scene.platforms = this.scene.physics.add.staticGroup();

        // Render the left edge platform
        this.createLeftPlatform(scene, left_x, y);

        // The longer the platform length, the more center platforms should be added to the scene
        let x;
        for(x=left_x+100; x<right_x; x+=100) {
            this.createCenterPlatform(scene,x,y);
        }

        // Render the right edge platform
        this.createRightPlatform(scene, right_x, y);

        // Enable players to collide with the natural platform.
        this.onCollide = true;

        return this.scene.platforms;
    }

    /**
     * Renders a left edge platform of the natural platform at the specified coordinates
     *
     * @param scene: The game scene that is used for platform creation
     * @param pos_x: The X coordinate at which the boost platform should be created at.
     * @param pos_y: The Y coordinate at which the boost platform should be created at.
     */
    createLeftPlatform(scene, pos_x, pos_y) {
        scene.platforms.create(pos_x, pos_y, 'ground-left').setScale(2).setData({'type': 'natural'});
    }

    /**
     * Renders a center platform of the natural platform at the specified coordinates
     *
     * @param scene: The game scene that is used for platform creation
     * @param pos_x: The X coordinate at which the boost platform should be created at.
     * @param pos_y: The Y coordinate at which the boost platform should be created at.
     */
    createCenterPlatform(scene, pos_x, pos_y) {
        scene.platforms.create(pos_x, pos_y, 'ground-center').setScale(2).setData({'type': 'natural'});
    }

    /**
     * Renders a right platform of the natural platform at the specified coordinates
     *
     * @param scene: The game scene that is used for platform creation
     * @param pos_x: The X coordinate at which the boost platform should be created at.
     * @param pos_y: The Y coordinate at which the boost platform should be created at.
     */
    createRightPlatform(scene, pos_x, pos_y) {
        scene.platforms.create(pos_x, pos_y, 'ground-right').setScale(2).setData({'type': 'natural'});
    }
}