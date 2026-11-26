<?php

declare(strict_types=1);

namespace App\Commands\Agents\OpenAccountOwner;

use App\Agents\Drivers\Setup\DriverProfiles;
use App\Agents\Drivers\Work\HeadlessStarts;
use App\Commands\Hosts\OpenHostProcess\OpenHostProcessCommand;
use App\Contracts\Bus\CommandHandler;
use App\Contracts\Bus\JournalCommands;
use App\Enums\Accounts\CommandEntry;
use App\Models\Agents\AgentRuntime;
use App\Models\Hosts\HostProcess;
use App\Models\Projects\Host;
use App\Models\Sessions\SessionProcess;
use App\Values\HostOrderSource;

final readonly class OpenAccountOwnerHandler implements CommandHandler
{
    private const string TRUSTED_ENTRY = 'headless starts';

    public function __construct(
        private HeadlessStarts $headless,
        private DriverProfiles $profiles,
        private JournalCommands $commands,
    ) {}

    public function handle(OpenAccountOwnerCommand $command): string|null
    {
        $runtime = AgentRuntime::query()->withSessionAgent()->whereKey($command->runtimeId)->sole();
        // The host's row is the lock two runtimes of one account take, so only one opens their owner.
        Host::findLocked($runtime->host_id);
        $start = SessionProcess::findLockedCurrentOf($runtime->agent_session_id);

        $isOwnerDue = $start !== null
            && $runtime->hasProvenStart()
            && ! HostProcess::hasLiveOwnerOf($runtime->host_id, $start);

        if (! $isOwnerDue) {
            return null;
        }

        $plan = $this->profiles->of($runtime)->ownerPlan($this->headless->startOf($runtime, $start));
        $open = new OpenHostProcessCommand($runtime->host_id, null, $plan, HostOrderSource::fromJournal(), $start->id);

        return $this->commands->runAsJournal(CommandEntry::HostControl, self::TRUSTED_ENTRY, $open);
    }
}
