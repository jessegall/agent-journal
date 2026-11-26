<?php

declare(strict_types=1);

namespace App\Hosts\Commands\RecordProtectionEvidence;

use App\Accounts\Enums\CommandEntry;
use App\Agents\Drivers\Contracts\PinnedBuilds;
use App\Bus\Contracts\CommandHandler;
use App\Bus\Contracts\JournalCommands;
use App\Hosts\Commands\JudgeHostProtection\JudgeHostProtectionCommand;
use App\Models\Projects\Host;
use App\Values\ProtectionReport;

final readonly class RecordProtectionEvidenceHandler implements CommandHandler
{
    private const string TRUSTED_ENTRY = 'host protection';

    public function __construct(private PinnedBuilds $builds, private JournalCommands $commands) {}

    public function handle(RecordProtectionEvidenceCommand $command): void
    {
        $build = $this->builds->versionOf($command->family);
        $key = ProtectionReport::unreported($command->family, $build, $command->platform->value)->key();
        Host::findLocked($command->hostId)->recordProtectionRuns($key, $command->items, $command->run);

        $judge = new JudgeHostProtectionCommand($command->hostId, $command->family, $command->platform);
        $this->commands->runAsJournal(CommandEntry::HostControl, self::TRUSTED_ENTRY, $judge);
    }
}
