<?php

declare(strict_types=1);

namespace App\Events\Accounts;

/**
 * A profile was retired.
 */
final readonly class ProfileRetired implements AccountEvent
{
    public function __construct(
        public string $profileId,
    ) {}
}
