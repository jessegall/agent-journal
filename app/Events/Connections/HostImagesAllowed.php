<?php

declare(strict_types=1);

namespace App\Events\Connections;

/** The host kept the images it may run. */
final readonly class HostImagesAllowed implements ConnectionEvent
{
    public function __construct(public string $hostId) {}
}
