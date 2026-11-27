<?php

declare(strict_types=1);

namespace App\Hosts\Commands\RecordDriverImageRefusal;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * Settles the host's driver images whose build, allow set or start checks the host refused or let expire: an
 * interruption builds the image again, a bad recipe refuses it. Run by the journal itself when such an instruction is
 * refused (internal, not exported).
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class RecordDriverImageRefusalCommand extends Command
{
    public function __construct(public string $instructionId) {}
}
