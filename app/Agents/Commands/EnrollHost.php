<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Handlers\EnrollHostHandler;
use App\Agents\Support\EnrolledHost;
use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * Enrolls a machine that may run agent programs, with the folders it may start in; its secret is given once.
 *
 * @extends Command<EnrolledHost>
 */
#[HandledBy(EnrollHostHandler::class)]
#[Entry(CommandEntry::HostControl)]
final readonly class EnrollHost extends Command
{
    /**
     * @param  list<string>  $startRoots
     */
    public function __construct(
        public string $installationName,
        public array $startRoots,
    ) {}
}
