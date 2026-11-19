<?php

declare(strict_types=1);

namespace App\Hooks\Programs;

use App\Hooks\Actions\RecordProgramFailure;
use App\Hooks\Contracts\ProgramCall;
use App\Hooks\Inputs\FailureDetails;
use App\Hooks\Inputs\HookIdentity;
use Closure;

/**
 * A native notification that a request failed: the journal records it for recovery and answers with the empty reply
 * of a hook that only reports. It never walks the stack, so it cannot change a permission decision.
 */
final readonly class NotificationCall implements ProgramCall
{
    public function __construct(
        private HookIdentity $hook,
        private FailureDetails $details,
        private RecordProgramFailure $failures,
    ) {}

    public function replyWith(Closure $answerByJournal): ProgramReply
    {
        $this->failures->record($this->hook, $this->details);

        return ProgramReply::emptyObject();
    }
}
