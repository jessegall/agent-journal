<?php

declare(strict_types=1);

namespace Domain\Sequences\Events;

/**
 * A stored sequence's name, summary or steps changed; its version went up by one.
 */
final readonly class SequenceChanged extends SequenceEvent
{
    public function __construct(public string $sequenceId) {}
}
