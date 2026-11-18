<?php

declare(strict_types=1);

namespace App\Hooks\Stack;

use App\Agents\Actions\LaunchSessions;
use App\Agents\Support\StackTarget;
use App\Hooks\Contracts\HookInput;
use App\Hooks\Inputs\SessionStarted;

/**
 * What the machine does for every new hook, after the replay check and inside its transaction: a session start, also
 * after a clear or a resume, records the program's own session id on the same journal session; a compaction keeps
 * the program's session and every other hook starts nothing, so they map nothing.
 */
final readonly class SessionStartStep
{
    public function __construct(private LaunchSessions $sessions) {}

    public function run(HookInput $input, StackTarget $target): void
    {
        if ($input instanceof SessionStarted) {
            $this->sessions->mapProgramSessionFor($target->sessionId, $input->start->vendorSessionId);
        }
    }
}
