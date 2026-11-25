<?php

declare(strict_types=1);

namespace App\Events\Engine;

/**
 * A number group was retired.
 */
final readonly class NumberGroupRetired implements EngineEvent
{
    public function __construct(
        public string $groupId,
    ) {}
}
