<?php

declare(strict_types=1);

namespace App\Support\Stack;

use App\Exceptions\ConversationIncompatible;
use App\Support\ConversationVisits;
use App\Support\Inputs\Contracts\HookInput;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;

/**
 * What the machine does for every new hook, after the replay check and inside its transaction: a session start, also
 * after a clear or a resume, records the native conversation the journal session entered, checked against its start
 * context; a compaction adds a visit to the current conversation; every other hook starts nothing.
 */
final readonly class SessionStartStep
{
    public function __construct(private ConversationVisits $visits) {}

    /**
     * @throws ConversationIncompatible
     */
    public function run(HookInput $input, StackTarget $target): void
    {
        $input->recordVisit($this->visits, $target->sessionId, CarbonImmutable::now());
    }
}
