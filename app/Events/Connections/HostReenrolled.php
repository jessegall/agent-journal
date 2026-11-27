<?php

declare(strict_types=1);

namespace App\Events\Connections;

/**
 * An installation enrolled its host again under the same name: the host keeps its row and takes the new secret.
 */
final readonly class HostReenrolled implements ConnectionEvent
{
    public function __construct(public string $hostId) {}
}
