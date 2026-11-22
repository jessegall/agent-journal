<?php

declare(strict_types=1);

namespace Domain\Plans\Support;

/**
 * Which pages of a plan's outline a reader asks for: the phase headings after a phase number, and, when it names a
 * phase, that phase's tasks after a position at the phase revision the reader holds.
 */
final readonly class OutlinePageAsk
{
    public function __construct(
        public int $phasesAfter = 0,
        public int|null $phase = null,
        public int $tasksAfter = 0,
        public int $revision = 0,
    ) {}
}
