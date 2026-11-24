<?php

declare(strict_types=1);

namespace Domain\Chat\Commands\SettleMarkedChats;

use App\Contracts\Admission\MaintenanceAdmission;
use App\Contracts\Chat\InboxResolver;
use Domain\Chat\Commands\Support\ChatCommandHandler;
use Domain\Chat\Models\Conversation;
use Domain\Chat\Support\ChatInboxAccess;

/**
 * Locks each marked chat of the batch, in inbox order, under the engine's grant: taking the lock settles what the
 * chat owes, exactly as a post into it would.
 */
final readonly class SettleMarkedChatsHandler extends ChatCommandHandler
{
    public function __construct(
        private MaintenanceAdmission $admission,
        private InboxResolver $inboxes,
        private ChatInboxAccess $access,
    ) {}

    public function handle(SettleMarkedChatsCommand $command): void
    {
        $this->admission->assertMaintenanceGranted(SettleMarkedChatsCommand::MAINTENANCE_SCOPE);

        foreach (Conversation::markedBatch(SettleMarkedChatsCommand::BATCH_LIMIT) as $inboxId) {
            $this->access->lockExclusive($this->inboxes->resolve($inboxId));
        }
    }
}
