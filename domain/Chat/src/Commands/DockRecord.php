<?php

declare(strict_types=1);

namespace Domain\Chat\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Records\Support\RecordIdentity;
use Domain\Chat\Handlers\DockRecordHandler;
use Domain\Chat\Policies\DockedRecordPolicy;
use Domain\Chat\Support\ConversationPair;

/**
 * Docks one readable record above the composer of a conversation, for the asker only.
 *
 * @extends Command<null>
 */
#[RetainedActorRequestKey]
#[HandledBy(DockRecordHandler::class)]
#[Authorize(DockedRecordPolicy::class, AccessType::Edit)]
final readonly class DockRecord extends Command
{
    public function __construct(
        public string $sourceInboxId,
        public string $destinationInboxId,
        public RecordIdentity $record,
    ) {}

    public function conversation(): ConversationPair
    {
        return new ConversationPair($this->sourceInboxId, $this->destinationInboxId);
    }
}
