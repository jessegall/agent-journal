<?php

declare(strict_types=1);

namespace App\Events;

/**
 * A profile was retired.
 */
final readonly class ProfileRetired extends AccountEvent
{
    public function __construct(
        public string $profileId,
    ) {}
}
