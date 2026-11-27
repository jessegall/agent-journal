<?php

declare(strict_types=1);

namespace App\Hosts\Commands\RecordDriverImageAnswer;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * Moves the host's driver images along by the host's answer to their build, allow set or start checks: a build is
 * judged, an allowed image is checked, a checked one is ready. Run by the journal itself when a host answers one of
 * these instructions (internal, not exported).
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class RecordDriverImageAnswerCommand extends Command
{
    public function __construct(public string $instructionId) {}
}
