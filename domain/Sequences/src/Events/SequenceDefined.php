<?php

declare(strict_types=1);

namespace Domain\Sequences\Events;

use App\Contracts\Event;

/**
 * A sequence was stored with its name, summary and steps.
 */
final readonly class SequenceDefined implements Event
{
    public function __construct(public string $sequenceId) {}
}
