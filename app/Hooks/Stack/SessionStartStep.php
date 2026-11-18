<?php

declare(strict_types=1);

namespace App\Hooks\Stack;

use App\Agents\Actions\RecordConversationVisit;
use App\Agents\Exceptions\ConversationIncompatible;
use App\Agents\Support\StackTarget;
use App\Hooks\Contracts\HookInput;
use App\Hooks\Inputs\ContextCompacted;
use App\Hooks\Inputs\SessionStarted;
use Carbon\CarbonImmutable;

/**
 * What the machine does for every new hook, after the replay check and inside its transaction: a session start, also
 * after a clear or a resume, records the native conversation the journal session entered, checked against its launch
 * context; a compaction adds a visit to the current conversation; every other hook starts nothing.
 */
final readonly class SessionStartStep
{
    public function __construct(private RecordConversationVisit $visits) {}

    /**
     * @throws ConversationIncompatible
     */
    public function run(HookInput $input, StackTarget $target): void
    {
        if ($input instanceof SessionStarted) {
            $this->visits->entered($target->sessionId, $input->start->vendorSessionId, $input->identity()->hookId, CarbonImmutable::now());
        }

        if ($input instanceof ContextCompacted) {
            $this->visits->compacted($target->sessionId, $input->identity()->hookId, CarbonImmutable::now());
        }
    }
}
