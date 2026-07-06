<?php

namespace AmeliaBooking\Infrastructure\Licence\Developer;

use AmeliaBooking\Infrastructure\API\Api;
use AmeliaBooking\Infrastructure\Common\Container;
use AmeliaBooking\Infrastructure\Routes;
use Slim\App;
use AmeliaBooking\Infrastructure\Licence\LicenceConstants;

/**
 * Class Licence
 *
 * @package AmeliaBooking\Infrastructure\Licence\Developer
 */
class Licence extends \AmeliaBooking\Infrastructure\Licence\Pro\Licence
{
    public static $licence = LicenceConstants::DEVELOPER;

    /**
     * @param Container $c
     */
    public static function getCommands($c)
    {
        return array_merge(
            parent::getCommands($c),
            [
            ]
        );
    }

    /**
     * @param App       $app
     * @param Container $container
     */
    public static function setRoutes(App $app, Container $container)
    {
        parent::setRoutes($app, $container);

        Api::routes($app, $container);

        Routes\Mobile\MobileV1::routes($app);
    }
}
