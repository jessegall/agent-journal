<?php

declare(strict_types=1);

namespace App\Processes\Console;

use App\Actors\Exceptions\ConsoleOwnerMissing;
use App\Bus\Support\ConsoleOwner;
use App\Processes\Support\ShippedReaderInstaller;
use App\Processes\Values\ToolVersions;
use Illuminate\Console\Command;

/**
 * Approves, as the journal's owner, the readers Core ships for the tools this project has installed at the version
 * each was proven on; a tool at another version is left reader_required.
 */
final class InstallShippedReadersCommand extends Command
{
    protected $signature = 'process:install-shipped-readers';

    protected $description = 'Approve the readers Core ships for the installed tools that match them';

    /**
     * @throws ConsoleOwnerMissing
     */
    public function handle(ConsoleOwner $owner, ShippedReaderInstaller $installer): int
    {
        $owner->actAsOwner();

        try {
            $installed = $installer->install(ToolVersions::ofProject(base_path()), base_path());
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
