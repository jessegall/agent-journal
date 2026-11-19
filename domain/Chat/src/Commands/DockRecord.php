<?php

declare(strict_types=1);

namespace Domain\Chat\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Records\Support\RecordIdentity;
use Domain\Chat\Enums\DockedRecordAbility;
use Domain\Chat\Handlers\DockRecordHandler;
use Domain\Chat\Models\DockedRecord;
use Domain\Chat\Policies\DockedRecordPolicy;
use Domain\Chat\Support\ConversationPair;

/**
 * Docks one readable record above the composer of a conversation, for the asker only.
 *
 * @implements Command<null>
 */
#[HandledBy(DockRecordHandler::class)]
#[Authorize(DockedRecordPolicy::class, DockedRecordAbility::Work)]
#[RetainedActorRequestKey]
final readonly class DockRecord implements Command, HasAuthorizationSubject
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
