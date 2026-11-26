<?php

declare(strict_types=1);

namespace App\Commands\Sessions\RunStopConditions;

use App\Commands\Hosts\RunFenced\RunFencedCommand;
use App\Contracts\Bus\CommandHandler;
use App\Contracts\Bus\JournalCommands;
use App\Contracts\Sessions\SessionPolicyReader;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Sessions\StopCheckStatus;
use App\Models\Agents\AgentRuntime;
use App\Models\Sessions\StopCheck;
use App\Values\StopCondition;

/**
 * Orders the attempt's conditions run under the session's fence on its runtime's host, the agent itself waiting at
 * its stop; the attempt of a session with no runtime stays pending, as no host can run its conditions.
 */
final readonly class RunStopConditionsHandler implements CommandHandler
{
    private const string TRUSTED_ENTRY = 'stop conditions';

    public function __construct(private SessionPolicyReader $policies, private JournalCommands $commands) {}

    public function handle(RunStopConditionsCommand $command): void
    {
        $attempt = StopCheck::query()->acrossSessions()->lockForUpdate()->findOrFail($command->attemptId);

        if ($attempt->status !== StopCheckStatus::Pending) {
            return;
        }

        $runtime = AgentRuntime::findForSession($attempt->session_id);

        if ($runtime === null) {
            return;
        }

        $conditions = $this->policies->policyFor($attempt->session_id)->stopConditions;

        if ($conditions->isEmpty()) {
            return;
        }

        $runs = array_map(
            fn (StopCondition $condition) => $condition->runIn($runtime->canonical_folder),
            $conditions->conditions,
        );

        $fenced = new RunFencedCommand(
            $runtime->host_id,
            $attempt->session_id,
            $runtime->liveAgentProcessIds(),
            $runs,
            $conditions->attemptSeconds * 1000,
        );

        $attempt->runUnder($this->commands->runAsJournal(CommandEntry::HostControl, self::TRUSTED_ENTRY, $fenced));
    }
}
