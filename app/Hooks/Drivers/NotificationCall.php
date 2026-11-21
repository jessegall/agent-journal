<?php

declare(strict_types=1);

namespace App\Hooks\Drivers;

use App\Hooks\Actions\RecordDriverFailure;
use App\Hooks\Contracts\DriverCall;
use App\Hooks\Inputs\FailureDetails;
use App\Hooks\Inputs\HookIdentity;
use Closure;
use App\Hooks\Drivers\DriverReply;

/**
 * A native notification that a request failed: the journal records it for recovery and answers with the empty reply
 * of a hook that only reports. It never walks the stack, so it cannot change a permission decision.
 */
final readonly class NotificationCall implements DriverCall
{
    public function __construct(
        private HookIdentity $hook,
        private FailureDetails $details,
        private RecordDriverFailure $failures,
    ) {}

    public function replyWith(Closure $answerByJournal): DriverReply
    {
        $this->failures->record($this->hook, $this->details);

        return DriverReply::emptyObject();
    }
}
