<?php

declare(strict_types=1);

namespace App\Agents\Values;

/**
 * How a numbered report landed: new, or a replay of one stored before; and whether reports of its generation are
 * missing before it.
 */
final readonly class RecordedEvent
{
    public function __construct(
        public bool $isReplay,
        public bool $followsGap,
    ) {}
}
