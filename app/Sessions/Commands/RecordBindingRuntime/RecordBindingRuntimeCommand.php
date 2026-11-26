<?php

declare(strict_types=1);

namespace App\Sessions\Commands\RecordBindingRuntime;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * Records a binding's start under the id its device chose, with the runtime the start opened.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class RecordBindingRuntimeCommand extends Command
{
    public function __construct(
        public string $bindingId,
        public string $startId,
        public string $sessionId,
        public string $runtimeId,
    ) {}
}
