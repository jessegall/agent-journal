<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Enums\ArrangementType;
use App\Agents\Support\EnrolledHost;
use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * Enrolls a machine that may run agent programs, with the folders it may start in and the arrangement it runs them in,
 * local unless it is the contained agent-host service; its secret is given once.
 *
 * @extends Command<EnrolledHost>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class EnrollHost extends Command
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
