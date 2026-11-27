<?php

declare(strict_types=1);

namespace App\Agents\Commands\OpenJournalTerminal;

use App\Accounts\Enums\CommandEntry;
use App\Agents\Drivers\Setup\DriverProfiles;
use App\Agents\Drivers\Work\HeadlessStarts;
use App\Bus\Contracts\CommandHandler;
use App\Bus\Contracts\JournalCommands;
use App\Hosts\Commands\OpenHostProcess\OpenHostProcessCommand;
use App\Hosts\Enums\HostProcessPurpose;
use App\Hosts\Protocol\HostProcessType;
use App\Models\Agents\AgentRuntime;
use App\Models\Sessions\SessionProcess;
use App\Values\HostOrderSource;

final readonly class OpenJournalTerminalHandler implements CommandHandler
{
    private const string TRUSTED_ENTRY = 'journal terminals';

    public function __construct(
        private HeadlessStarts $starts,
        private DriverProfiles $profiles,
        private JournalCommands $commands,
    ) {}

    public function handle(OpenJournalTerminalCommand $command): string|null
    {
        $runtime = AgentRuntime::query()
            ->withSessionAgent()
            ->whereKey($command->runtimeId)
            ->lockForUpdate()
            ->sole();

        $isOpen = $runtime->hasLiveProcess(HostProcessPurpose::AgentTerminal);

        if (! $this->starts->drives($runtime) || ! $runtime->hasProvenStart() || $isOpen) {
            return null;
        }

        $start = SessionProcess::findLockedCurrentOf($runtime->agent_session_id);

        if ($start === null) {
            return null;
        }

        $terminal = $this->starts->startOf($runtime, $start)->openedAs(HostProcessType::Terminal);
        $settings = $this->starts->clientSettingsOf($runtime);
        $profile = $this->profiles->of($runtime);
        $plan = $profile->startPlan($terminal)->withEnvironment($settings->environment());
        $source = HostOrderSource::fromJournal();
        $open = new OpenHostProcessCommand($runtime->host_id, $runtime->id, $plan, $source, $start->id);

        return $this->commands->runAsJournal(CommandEntry::HostControl, self::TRUSTED_ENTRY, $open);
    }
}
