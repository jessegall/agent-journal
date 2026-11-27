<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Bus\ConsoleOwner;
use App\CommandRules\ShippedReaderInstaller;
use App\CommandRules\Values\ToolVersions;
use App\Console\Concerns\ReadsProjectOption;
use App\Exceptions\ConsoleOwnerMissing;
use Illuminate\Console\Command;

/**
 * Approves, as the journal's owner, the readers Core ships for the tools this folder has installed at the version
 * each was proven on, into the named project or the local one; a tool at another version is left reader_required.
 */
final class InstallShippedReadersCommand extends Command
{
    use ReadsProjectOption;

    protected $signature = 'process:install-shipped-readers'
        .' {--project= : The key of the project to install into, the local project when none is given}';

    protected $description = 'Approve the readers Core ships for the installed tools that match them';

    /**
     * @throws ConsoleOwnerMissing
     */
    public function handle(ConsoleOwner $owner, ShippedReaderInstaller $installer): int
    {
        $project = $this->project();
        $owner->actAsOwner();

        try {
            $installed = $installer->install(ToolVersions::ofProject(base_path()), base_path(), $project);
        } finally {
            $owner->finish();
        }

        if ($installed === []) {
            $this->line('No installed tool matches a shipped reader.');

            return self::SUCCESS;
        }

        $this->line('Approved: '.implode(', ', $installed).'.');

        return self::SUCCESS;
    }
}
