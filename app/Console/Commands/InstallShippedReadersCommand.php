<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Exceptions\ConsoleOwnerMissing;
use App\Models\Projects\Project;
use App\Support\ConsoleOwner;
use App\Support\ShippedReaderInstaller;
use App\Values\ToolVersions;
use Illuminate\Console\Command;

/**
 * Approves, as the journal's owner, the readers Core ships for the tools this folder has installed at the version
 * each was proven on, into the named project or the local one; a tool at another version is left reader_required.
 */
final class InstallShippedReadersCommand extends Command
{
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

    private function project(): Project
    {
        $key = $this->option('project');

        if (! is_string($key)) {
            return Project::findLocal();
        }

        return Project::findForKey($key);
    }
}
