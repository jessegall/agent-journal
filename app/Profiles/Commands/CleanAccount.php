<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;
use App\Profiles\Handlers\CleanAccountHandler;
use App\Profiles\Values\CleanupProgress;

/**
 * The host reports what it proved of a removed account's cleanup in the generation it was asked in: its sign-in
 * store gone and its folder gone, as two proofs. Run for an authenticated host by the journal itself (internal, not
 * exported).
 *
 * @extends Command<bool>
 */
#[Entry(CommandEntry::HostControl)]
#[HandledBy(CleanAccountHandler::class)]
final readonly class CleanAccount extends Command
{
    public function __construct(
        public string $hostId,
        public string $accountId,
        public int $generation,
        public CleanupProgress $progress,
    ) {}
}
