<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Drivers\TerminalGrantEvent;

/**
 * A terminal grant handed out its next input sequence number.
 */
final readonly class TerminalGrantSequenceTaken extends SessionEvent implements TerminalGrantEvent
{
    public function __construct(
        public string $grantId,
        public int $sequence,
    ) {}
}
