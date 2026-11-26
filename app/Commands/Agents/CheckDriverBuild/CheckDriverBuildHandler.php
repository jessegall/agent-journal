<?php

declare(strict_types=1);

namespace App\Commands\Agents\CheckDriverBuild;

use App\Commands\Hosts\OpenHostProcess\OpenHostProcessCommand;
use App\Contracts\Bus\CommandHandler;
use App\Contracts\Bus\JournalCommands;
use App\Enums\Accounts\CommandEntry;
use App\Exceptions\BuildNotPinned;
use App\Models\Hosts\HostProcess;
use App\Support\Drivers\HeadlessStarts;
use App\Support\Drivers\Profiles\ClaudeCodeProfile;
use App\Support\StartHeartbeats;
use App\Values\HostOrderSource;

final readonly class CheckDriverBuildHandler implements CommandHandler
{
    private const string TRUSTED_ENTRY = 'headless starts';

    public function __construct(
        private ClaudeCodeProfile $profile,
        private StartHeartbeats $heartbeats,
        private HeadlessStarts $headless,
        private JournalCommands $commands,
    ) {}

    public function handle(CheckDriverBuildCommand $command): void
    {
        $process = HostProcess::query()->with('runtime')->whereKey($command->processId)->sole();
        $start = $process->sessionProcess()->lockForUpdate()->sole();
        $runtime = $process->runtime;

        try {
            $this->profile->assertPinnedBuild($command->printed);
        } catch (BuildNotPinned $refusal) {
            $this->heartbeats->refuseStart($start, $refusal->getMessage());

            return;
        }

        $driverStart = $this->headless->startOf($runtime, $start);
        $probe = $this->profile->signInProbe($driverStart);
        $source = HostOrderSource::fromJournal();
        $open = new OpenHostProcessCommand($process->host_id, $runtime->id, $probe, $source, $start->id);

        $this->commands->runAsJournal(CommandEntry::HostControl, self::TRUSTED_ENTRY, $open);
    }
}
