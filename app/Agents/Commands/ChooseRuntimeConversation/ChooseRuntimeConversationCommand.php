<?php

declare(strict_types=1);

namespace App\Agents\Commands\ChooseRuntimeConversation;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * Makes the conversation the driver started for the runtime the one its later turns continue, for a driver that names
 * its conversations itself, as Codex names a thread (internal, not exported).
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::DriverWorker)]
final readonly class ChooseRuntimeConversationCommand extends Command
{
    public function __construct(public string $runtimeId, public string $conversationId) {}
}
