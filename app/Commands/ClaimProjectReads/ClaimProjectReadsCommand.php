<?php

declare(strict_types=1);

namespace App\Commands\ClaimProjectReads;

use App\Attributes\Entry;
use App\Enums\CommandEntry;
use App\Support\Command;
use App\Values\ProjectReadClaims;

/**
 * A host takes the reads of its connected projects that wait for it, each handed out once.
 * Run for an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<ProjectReadClaims>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class ClaimProjectReadsCommand extends Command
{
    /**
     * The most reads one claim hands out.
     */
    public const int CLAIM_LIMIT = 10;

    public function __construct(public string $hostId) {}
}
