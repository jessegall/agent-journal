<?php

declare(strict_types=1);

namespace Domain\Chat\Commands\SettleMarkedChats;

use App\Attributes\Entry;
use App\Enums\CommandEntry;
use App\Support\Command;

/**
 * Settles one bounded batch of the chats marked as owing a reconcile that nobody opened since; the engine runs it on
 * each pass.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::EngineMaintenance)]
final readonly class SettleMarkedChatsCommand extends Command
{
    /**
     * The maintenance capability the engine grants for this sweep.
     */
    public const string MAINTENANCE_SCOPE = 'chat.reconcile';

    /**
     * The most chats one pass settles.
     */
    public const int BATCH_LIMIT = 20;
}
