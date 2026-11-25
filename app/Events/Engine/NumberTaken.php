<?php

declare(strict_types=1);

namespace App\Events\Engine;

/**
 * A number group handed out its next number.
 */
final readonly class NumberTaken implements EngineEvent
{
    public function __construct(
        public string $groupId,
        public int $number,
    ) {}
}
