<?php

declare(strict_types=1);

namespace App\Hosts\Contracts;

use App\Agents\Drivers\Setup\DriverProfile;
use App\Models\Projects\Host;
use App\Models\Projects\HostDriverImage;
use App\Models\Sessions\SessionProcess;

/**
 * The driver images a contained host keeps, one row per recipe, and the starts that wait for them.
 */
interface HostDriverImages
{
    /**
     * Reserves the host's row of every distinct recipe of the deployed drivers, and answers their ids.
     *
     * @return list<string>
     */
    public function reserveAll(Host $host): array;

    /**
     * The host's row of the driver's current recipe, reserved when it is new: a start that arrives before the host's
     * first claim reserves the same row the claim would.
     */
    public function imageFor(Host $host, DriverProfile $driver): HostDriverImage;

    /**
     * Registers the start's wait under the row's lock and answers whether the image is already ready, so no wait is
     * lost between a look at the row and the registration.
     */
    public function awaitFor(HostDriverImage $image, SessionProcess $start): bool;

    /**
     * The images the host's containers may run: the base and every driver image built and not refused.
     *
     * @return list<string>
     */
    public function allowSetOf(Host $host): array;

    /**
     * Whether the host must be sent its allow set: it last allowed other images, or an image waits for a set that
     * names it since it was built.
     */
    public function needsAllowSet(Host $host): bool;
}
