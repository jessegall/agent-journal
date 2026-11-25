<?php

declare(strict_types=1);

namespace App\Values;

use App\Support\ActorReference;

/**
 * An ask that needs a supervisor profile's helper started: the profile, the ask that causes it, what it asks and the
 * actor that asked, who stays the cause of the start.
 */
final readonly class SupervisorRequest
{
    public function __construct(
        public string $profileKey,
        public string $askId,
        public string $body,
        public ActorReference $cause,
    ) {}
}
