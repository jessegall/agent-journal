<?php

declare(strict_types=1);

namespace App\Support\Drivers\Adapters;

use App\Support\Drivers\Contracts\DriverCall;
use App\Support\Drivers\DriverReply;
use App\Support\Inputs\FailureDetails;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\RecordDriverFailure;
use Closure;

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
