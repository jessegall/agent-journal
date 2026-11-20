<?php

declare(strict_types=1);

namespace Domain\Chat\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Records\Support\RecordIdentity;
use Domain\Chat\Enums\DockedRecordAbility;
use Domain\Chat\Handlers\DockRecordHandler;
use Domain\Chat\Models\DockedRecord;
use Domain\Chat\Policies\DockedRecordPolicy;
use Domain\Chat\Support\ConversationPair;

/**
 * Docks one readable record above the composer of a conversation, for the asker only.
 *
 * @extends Command<null>
 */
#[RetainedActorRequestKey]
#[HandledBy(DockRecordHandler::class)]
#[Authorize(DockedRecordPolicy::class, DockedRecordAbility::Work)]
#[Operation('dock_record', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class DockRecord extends Command implements AuthorizedCommand
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

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return DockedRecord::class;
    }
}
