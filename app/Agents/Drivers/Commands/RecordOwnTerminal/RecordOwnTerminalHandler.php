<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Commands\RecordOwnTerminal;

use App\Agents\Drivers\Work\OwnTerminalPlans;
use App\Bus\Contracts\CommandHandler;
use App\Hosts\Enums\HostProcessPurpose;
use App\Models\Agents\AgentRuntime;
use App\Models\Hosts\HostProcess;
use App\Models\Projects\Host;
use App\Models\Sessions\SessionProcess;
use App\Sessions\Exceptions\SessionProcessUnknown;

final readonly class RecordOwnTerminalHandler implements CommandHandler
{
    public function __construct(private OwnTerminalPlans $plans) {}

    public function handle(RecordOwnTerminalCommand $command): RecordedOwnTerminal
    {
        $runtime = AgentRuntime::query()->withSessionAgent()->whereKey($command->runtimeId)->lockForUpdate()->sole();

        $start = SessionProcess::findLockedCurrentOf($runtime->agent_session_id)
            ?? throw SessionProcessUnknown::forSession($runtime->agent_session_id);

        $terminal = $runtime->hostProcesses()->live()->ofPurposes([HostProcessPurpose::AgentTerminal])->first();
        $plan = $this->plans->of($runtime);

        if ($command->wantsRawBytes) {
            $plan = $plan->askingRawBytes();
        }

        if ($terminal !== null) {
            return new RecordedOwnTerminal($terminal->id, $plan);
        }

        $host = Host::query()->findOrFail($runtime->host_id);
        $start->claimOn($host->id);
        $terminal = HostProcess::create($host, $runtime, $plan, $start);

        return new RecordedOwnTerminal($terminal->id, $plan);
    }
}
