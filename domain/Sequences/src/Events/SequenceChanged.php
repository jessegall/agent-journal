<?php

declare(strict_types=1);

namespace Domain\Sequences\Events;

use App\Contracts\Event;

/**
 * A stored sequence's name, summary or steps changed; its version went up by one.
 */
final readonly class SequenceChanged implements Event
{
    public function __construct(public string $sequenceId) {}
}
