<?php

declare(strict_types=1);

namespace App\Connections\Values;

/**
 * A started device grant: the code the owner checks and when it expires, in ISO 8601.
 */
final readonly class DeviceGrantStart
{
    public function __construct(public string $userCode, public string $expiresAt) {}
}
