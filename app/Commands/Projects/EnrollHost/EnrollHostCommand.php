<?php

declare(strict_types=1);

namespace App\Commands\Projects\EnrollHost;

use App\Attributes\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Projects\ArrangementType;
use App\Support\Command;
use App\Support\EnrolledHost;

/**
 * Enrolls a machine that may run agent drivers, with the folders it may start in and the arrangement it runs them in,
 * local unless it is the contained agent-host service; its secret is given once.
 *
 * @extends Command<EnrolledHost>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class EnrollHostCommand extends Command
{
    /**
     * @param  list<string>  $startRoots
     */
    public function __construct(
        public string $installationName,
        public array $startRoots,
        public ArrangementType $arrangement = ArrangementType::Local,
    ) {}
}
