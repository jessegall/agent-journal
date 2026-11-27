<?php

declare(strict_types=1);

namespace App\Hosts\Commands\NotifyHostInstruction;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * A host answers an instruction it claimed: carried out with its facts, or refused with its reason, as the JSON of the answer its call was read and validated into. Run for an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class NotifyHostInstructionCommand extends Command
{
    public function __construct(
        public string $hostId,
        public string $instructionId,
        public string $answer,
    ) {}
}
