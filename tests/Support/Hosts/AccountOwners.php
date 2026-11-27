<?php

declare(strict_types=1);

namespace Tests\Support\Hosts;

use App\Hosts\Enums\HostProcessPurpose;
use App\Models\Agents\AgentRuntime;
use App\Models\Hosts\HostProcess;
use App\Models\Sessions\SessionProcess;

/**
 * The live owner that runs the headless turns of a runtime's account, found as the journal finds it: by the account
 * generation of the runtime's current start.
 */
final class AccountOwners
{
    public static function liveOwnerOf(AgentRuntime $runtime): HostProcess|null
    {
        $start = SessionProcess::findCurrentOf($runtime->agent_session_id);

        if ($start === null) {
            return null;
        }

        return HostProcess::query()
            ->ofPurposes([HostProcessPurpose::AccountOwner])
            ->live()
            ->whereHas('sessionProcess', fn ($owned) => $owned->onAccountGenerationOf($start))
            ->latest('id')
            ->first();
    }
}
