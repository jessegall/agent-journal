<?php

declare(strict_types=1);

namespace App\Projects\Commands\EnrollHost;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Hosts\EnrolledHost;
use App\Projects\Enums\ArrangementType;
use App\Support\Command;

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
