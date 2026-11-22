<?php

declare(strict_types=1);

namespace App\Agents\Commands\RecordHostDescriptors;

use App\Agents\Values\HostDescriptor;
use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * Keeps the protocol version a host speaks and the driver descriptors it can run, as it reports them when it starts serving.
 * Run for an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<void>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class RecordHostDescriptorsCommand extends Command
{
    /**
     * @param  list<HostDescriptor>  $descriptors
     */
    public function __construct(
        public string $hostId,
        public int $protocolVersion,
        public array $descriptors,
    ) {}
}
