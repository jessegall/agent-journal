<?php

declare(strict_types=1);

namespace App\Events;

/**
 * A number group was retired.
 */
final readonly class NumberGroupRetired extends EngineEvent
{
    public function __construct(
        public string $groupId,
    ) {}
}
