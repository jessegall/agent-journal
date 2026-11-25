<?php

declare(strict_types=1);

namespace App\Commands\Projects\RecordBindingRuntimeStop;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;

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
