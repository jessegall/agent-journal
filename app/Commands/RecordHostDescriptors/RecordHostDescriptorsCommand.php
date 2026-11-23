<?php

declare(strict_types=1);

namespace App\Commands\RecordHostDescriptors;

use App\Attributes\Entry;
use App\Enums\CommandEntry;
use App\Support\Command;
use App\Values\HostDescriptor;

/**
 * Keeps the driver descriptors a host can run, as it reports them when it starts serving.
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
        public array $descriptors,
    ) {}
}
