<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Handlers\RecordHostCombinationsHandler;
use App\Agents\Values\HostCombination;
use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * Keeps the protocol version a host speaks and the combinations it can run, as it reports them when it starts serving.
 * Run for an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<void>
 */
#[Entry(CommandEntry::HostControl)]
#[HandledBy(RecordHostCombinationsHandler::class)]
final readonly class RecordHostCombinations extends Command
{
    /**
     * @param  list<HostCombination>  $combinations
     */
    public function __construct(
        public string $hostId,
        public int $protocolVersion,
        public array $combinations,
    ) {}
}
