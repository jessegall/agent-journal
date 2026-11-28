<?php

declare(strict_types=1);

namespace App\Events\Connections;

/** The host cleared the images it could run. */
final readonly class HostAllowedImagesForgotten implements ConnectionEvent
{
    public function __construct(public string $hostId) {}
}
