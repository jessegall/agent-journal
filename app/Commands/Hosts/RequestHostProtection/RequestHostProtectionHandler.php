<?php

declare(strict_types=1);

namespace App\Commands\Hosts\RequestHostProtection;

use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Isolation\IsolationProbes;
use App\Commands\Hosts\JudgeHostProtection\JudgeHostProtectionCommand;
use App\Commands\Hosts\OpenHostProcess\OpenHostProcessCommand;
use App\Contracts\Bus\CommandHandler;
use App\Contracts\Bus\JournalCommands;
use App\Contracts\Drivers\PinnedBuilds;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Drivers\IsolationPlatform;
use App\Enums\Hosts\HostProcessPurpose;
use App\Models\Hosts\HostProcess;
use App\Models\Projects\Host;
use App\Values\HostOrderSource;
use App\Values\ProtectionReport;

final readonly class RequestHostProtectionHandler implements CommandHandler
{
    private const string TRUSTED_ENTRY = 'host protection';

    public function __construct(
        private IsolationProbes $probes,
        private PinnedBuilds $builds,
        private JournalCommands $commands,
    ) {}

    public function handle(RequestHostProtectionCommand $command): void
    {
        $host = Host::findLocked($command->hostId);

        if (! $host->arrangement->isContained()) {
            return;
        }

        foreach (DefaultDrivers::familyKeys() as $family) {
            foreach ([IsolationPlatform::Container, IsolationPlatform::ProtectedContainer] as $platform) {
                $this->bringUpToDate($host, $family, $platform);
            }
        }
    }

    private function bringUpToDate(Host $host, string $family, IsolationPlatform $platform): void
    {
        // Only Claude Code in the standard container relies on its own sandbox, which the probes show runs or not.
        $readsSandbox = $family === DefaultDrivers::CLAUDE_CODE && $platform === IsolationPlatform::Container;

        if ($readsSandbox && ! $host->hasSandboxVerdictFor($this->probes->image())) {
            $this->openProbe($host);

            return;
        }

        $unreported = ProtectionReport::unreported($family, $this->builds->versionOf($family), $platform->value);

        if ($host->hasProtectionOf($unreported)) {
            return;
        }

        $judge = new JudgeHostProtectionCommand($host->id, $family, $platform);
        $this->commands->runAsJournal(CommandEntry::HostControl, self::TRUSTED_ENTRY, $judge);
    }

    private function openProbe(Host $host): void
    {
        if (HostProcess::hasLiveOfPurposesOn($host->id, HostProcessPurpose::isolationProbes())) {
            return;
        }

        $open = new OpenHostProcessCommand($host->id, null, $this->probes->socat(), HostOrderSource::fromJournal());
        $this->commands->runAsJournal(CommandEntry::HostControl, self::TRUSTED_ENTRY, $open);
    }
}
