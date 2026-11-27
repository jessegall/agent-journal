<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Sessions\Contracts\StopCheckEvent;

/**
 * A stop's conditions were ordered to the session's host, to run under the named run_fenced instruction.
 */
final readonly class StopCheckConditionsInstructed implements SessionEvent, StopCheckEvent
{
    public function __construct(public string $attemptId, public string $instructionId) {}
}
