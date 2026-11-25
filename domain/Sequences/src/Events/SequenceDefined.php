<?php

declare(strict_types=1);

namespace Domain\Sequences\Events;

/**
 * A sequence was stored with its name, summary and steps.
 */
final readonly class SequenceDefined implements SequenceEvent
{
    public function __construct(public string $sequenceId) {}
}
