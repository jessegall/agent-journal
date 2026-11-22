<?php

declare(strict_types=1);

namespace App\Pipes\Answer;

use App\Contracts\Pipe;
use App\Support\CallStages\LockedCall;
use App\Support\CallStages\PreparedCall;
use App\Support\ContextCollection;
use App\Support\FinishedToolCalls;
use App\Support\Stack\SessionStartStep;

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
