<?php

declare(strict_types=1);

namespace App\Agents\Events;

use App\Agents\Enums\ProgramFailure;
use App\Contracts\Event;
use App\Ui\Contracts\UpdatesUserInterface;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A launch's program reported that a request failed, and why in its checked vocabulary; the program's own error text
 * stays private.
 */
final readonly class ProgramFailed implements Event, ShouldDispatchAfterCommit, UpdatesUserInterface
{
    public function __construct(
        public string $agentId,
        public string $sessionId,
        public string $program,
        public ProgramFailure $failure,
    ) {}
}
