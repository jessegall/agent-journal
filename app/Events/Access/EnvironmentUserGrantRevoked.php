<?php

declare(strict_types=1);

namespace App\Events\Access;

/**
 * A user's grant to an environment was revoked.
 */
final readonly class EnvironmentUserGrantRevoked extends AccessEvent
{
    public function __construct(
        public string $grantId,
    ) {}
}
