<?php

declare(strict_types=1);

namespace App\Hosts\Commands\RequestHostProtection;

use App\Accounts\Enums\CommandEntry;
use App\Agents\Drivers\Contracts\PinnedBuilds;
use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Enums\IsolationPlatform;
use App\Bus\Contracts\CommandHandler;
use App\Bus\Contracts\JournalCommands;
use App\Hosts\Commands\JudgeHostProtection\JudgeHostProtectionCommand;
use App\Models\Projects\Host;
use App\Values\ProtectionReport;

final readonly class RequestHostProtectionHandler implements CommandHandler
{
    private const string TRUSTED_ENTRY = 'host protection';

    public function __construct(
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
            foreach ([
                IsolationPlatform::Container,
                IsolationPlatform::ProtectedContainer,
            ] as $platform) {
                $this->bringUpToDate($host, $family, $platform);
            }
        }
    }

    private function bringUpToDate(Host $host, string $family, IsolationPlatform $platform): void
    {
        $unreported = ProtectionReport::unreported($family, $this->builds->versionOf($family), $platform->value);

        if ($host->hasProtectionOf($unreported)) {
            return;
        }

        $judge = new JudgeHostProtectionCommand($host->id, $family, $platform);
        $this->commands->runAsJournal(CommandEntry::HostControl, self::TRUSTED_ENTRY, $judge);
    }
}
