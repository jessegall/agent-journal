<?php

declare(strict_types=1);

namespace App\Connections\Commands\RecordBindingStart;

use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * Records a binding's start under the id its device chose, with the runtime the start opened.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class RecordBindingStartCommand extends Command
{
    public function __construct(
        public string $bindingId,
        public string $startId,
        public string $sessionId,
        public string $runtimeId,
    ) {}
}
