<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Commands\Hosts\RecordProtectionEvidence\RecordProtectionEvidenceCommand;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Drivers\BoundaryItem;
use App\Enums\Drivers\IsolationPlatform;
use App\Support\JournalCommands;
use Illuminate\Console\Command;

/**
 * Records the run of a native procedure (tools/accounts/check-claude.php, check-codex.php) that showed boundary items
 * hold on a contained host, so the host's protection report counts them enforced.
 */
final class RecordProtectionRunCommand extends Command
{
    protected $signature = 'accounts:record-protection-run
        {host : the contained host the run was made on}
        {family : the driver family, such as claude-code}
        {platform : linux-container or linux-container-protected}
        {run : the id of the procedure run that showed the items hold}
        {items* : the boundary items the run showed hold}';

    protected $description = 'Record a run that showed protection items hold on a contained host';

    public function handle(JournalCommands $commands): int
    {
        $items = array_map(fn (string $item) => BoundaryItem::from($item), (array) $this->argument('items'));

        $record = new RecordProtectionEvidenceCommand(
            (string) $this->argument('host'),
            (string) $this->argument('family'),
            IsolationPlatform::from((string) $this->argument('platform')),
            array_values($items),
            (string) $this->argument('run'),
        );

        $commands->runAsJournal(CommandEntry::HostControl, 'protection evidence', $record);
        $this->info('Recorded the run and judged the protection again.');

        return self::SUCCESS;
    }
}
