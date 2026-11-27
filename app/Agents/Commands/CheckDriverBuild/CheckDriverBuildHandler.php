<?php

declare(strict_types=1);

namespace App\Agents\Commands\CheckDriverBuild;

use App\Accounts\Enums\CommandEntry;
use App\Agents\Drivers\Setup\DriverProfiles;
use App\Agents\Drivers\Work\HeadlessStarts;
use App\Agents\Exceptions\ProbeFailed;
use App\Bus\Contracts\CommandHandler;
use App\Bus\Contracts\JournalCommands;
use App\Hosts\Commands\OpenHostProcess\OpenHostProcessCommand;
use App\Models\Hosts\HostProcess;
use App\Sessions\StartHeartbeats;
use App\Values\HostInstructionSource;

final readonly class CheckDriverBuildHandler implements CommandHandler
{
    private const string TRUSTED_ENTRY = 'headless starts';

    public function __construct(
        private DriverProfiles $profiles,
        private StartHeartbeats $heartbeats,
        private HeadlessStarts $headless,
        private JournalCommands $commands,
    ) {}

    public function handle(CheckDriverBuildCommand $command): void
    {
        $process = HostProcess::query()->withRuntime()->whereKey($command->processId)->sole();
        $start = $process->sessionProcess()->lockForUpdate()->sole();
        $runtime = $process->runtime;

        $this->heartbeats->continueStart($start, function () use ($command, $process, $start, $runtime): void {
            $profile = $this->profiles->of($runtime);

            if (! $process->hasExitedWell()) {
                throw ProbeFailed::of($profile->family(), $process->end_evidence);
            }

            $profile->assertPinnedBuild($command->printed);
            $probe = $profile->signInProbe($this->headless->startOf($runtime, $start));
            $source = HostInstructionSource::fromJournal();
            $open = new OpenHostProcessCommand($process->host_id, $runtime->id, $probe, $source, $start->id);

            $this->commands->runAsJournal(CommandEntry::HostControl, self::TRUSTED_ENTRY, $open);
        });
    }
}
