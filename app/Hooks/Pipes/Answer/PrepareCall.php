<?php

declare(strict_types=1);

namespace App\Hooks\Pipes\Answer;

use App\Hooks\Stack\SessionStartStep;
use App\Hooks\Support\ContextCollection;
use App\Hooks\Support\FinishedToolCalls;
use App\Hooks\Values\Answer\LockedCall;
use App\Hooks\Values\Answer\PreparedCall;
use App\Pipelines\Contracts\Pipe;

/**
 * Does what a new call does before the walk, after the replay check: collects a context start's reminders, runs the
 * session-start step and announces a finished tool call.
 */
final readonly class PrepareCall implements Pipe
{
    public function __construct(
        private ContextCollection $context,
        private SessionStartStep $sessionStart,
        private FinishedToolCalls $toolCalls,
    ) {}

    public function handle(LockedCall $locked): PreparedCall
    {
        $call = $locked->call;
        $reminders = $this->context->collectReminders($call->target, $call->input);

        $this->sessionStart->run($call->input, $call->target);
        $this->toolCalls->announce($call->target, $call->input);

        return $locked->prepared($reminders);
    }
}
