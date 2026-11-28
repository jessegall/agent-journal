<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Hosts\Contracts\DriverImageEvent;

/**
 * A host's built driver image was replaced by a newer ready one of its driver and dropped, so the image it built is
 * no longer the journal's on that host.
 */
final readonly class DriverImageReplaced implements DriverImageEvent
{
    public function __construct(public string $hostDriverImageId, public string $hostId, public string $image) {}
}
