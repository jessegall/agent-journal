<?php

declare(strict_types=1);

namespace App\Agents\Commands\OpenAccountOwner;

use App\Accounts\Enums\CommandEntry;
use App\Agents\Drivers\Setup\DriverProfiles;
use App\Agents\Drivers\Work\HeadlessStarts;
use App\Bus\Contracts\CommandHandler;
use App\Bus\Contracts\JournalCommands;
use App\Hosts\Commands\OpenHostProcess\OpenHostProcessCommand;
use App\Models\Agents\AgentRuntime;
use App\Models\Hosts\HostProcess;
use App\Models\Projects\Host;
use App\Models\Sessions\SessionProcess;
use App\Values\HostInstructionSource;

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
        $open = new OpenHostProcessCommand(
            $runtime->host_id,
            null,
            $plan,
            HostInstructionSource::fromJournal(),
            $start->id,
        );

        return $this->commands->runAsJournal(CommandEntry::HostControl, self::TRUSTED_ENTRY, $open);
    }
}
