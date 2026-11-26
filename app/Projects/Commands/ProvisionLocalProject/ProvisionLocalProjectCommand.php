<?php

declare(strict_types=1);

namespace App\Projects\Commands\ProvisionLocalProject;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * Makes the installation's own project, its Main environment and the owner's grants on it, run as the journal when the
 * installation runs agents itself; a project of the key already there is left as it is.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class ProvisionLocalProjectCommand extends Command
{
    public function __construct(
        public string $ownerId,
        public string $key,
        public string $label,
    ) {}
}
