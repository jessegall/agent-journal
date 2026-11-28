<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Hosts\Contracts\DriverImageEvent;

/**
 * A host's replaced driver image row was dropped, along with any image it had built.
 */
final readonly class DriverImageReplaced implements DriverImageEvent
{
    public function __construct(public string $hostDriverImageId, public string $hostId, public string|null $image) {}
}
