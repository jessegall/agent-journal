<?php

declare(strict_types=1);

namespace Tests\Support\Terminals;

use App\Commands\Terminals\OpenTerminalView\OpenTerminalViewCommand;
use App\Commands\Terminals\TakeTerminalControl\TakeTerminalControlCommand;
use App\Data\Terminals\TerminalControlData;
use App\Enums\Drivers\DriverOperation;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverRequest;
use App\Models\Drivers\TerminalGrant;
use Illuminate\Support\Str;

/**
 * The owner watching a runtime on a host that carries out every browser input, and taking control of it; the host
 * hands out the grant as grant-1.
 */
trait TakesTerminalControl
{
    private const string GRANT = 'grant-1';

    private function controllableRuntime(): AgentRuntime
    {
        return $this->runtimeOn($this->journal->enrolledHost()->hostId);
    }

    private function openInterest(AgentRuntime $runtime): string
    {
        return $this->asOwner(
            new OpenTerminalViewCommand($runtime->session->agent_id, (string) Str::ulid()),
        )->readInterestId;
    }

    private function take(AgentRuntime $runtime, string $interest): TerminalControlData
    {
        return $this->asOwner(
            new TakeTerminalControlCommand($runtime->session->agent_id, $interest, (string) Str::ulid()),
        );
    }

    private function grantedRuntime(): AgentRuntime
    {
        $runtime = $this->controllableRuntime();
        $this->take($runtime, $this->openInterest($runtime));
        TerminalGrant::query()->acrossActors()->sole()->issue(self::GRANT);

        return $runtime;
    }

    private function sentCount(DriverOperation $operation): int
    {
        return DriverRequest::query()->where('operation', $operation)->count();
    }
}
