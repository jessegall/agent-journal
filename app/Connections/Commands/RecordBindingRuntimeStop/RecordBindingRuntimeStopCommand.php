<?php

declare(strict_types=1);

namespace App\Connections\Commands\RecordBindingRuntimeStop;

use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * Takes a binding's device receipt that one runtime's session stopped; sent again, it changes nothing.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class RecordBindingRuntimeStopCommand extends Command
{
    public function __construct(public string $hostId, public string $bindingId, public string $runtimeId) {}
}
