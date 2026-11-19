<?php

declare(strict_types=1);

namespace Domain\Chat\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use App\Records\Support\RecordIdentity;
use Domain\Chat\Enums\DockedRecordAbility;
use Domain\Chat\Handlers\RestoreDockedRecordHandler;
use Domain\Chat\Models\DockedRecord;
use Domain\Chat\Policies\DockedRecordPolicy;
use Domain\Chat\Support\ConversationPair;

/**
 * Shows the asker's hidden docked record in a conversation again.
 *
 * @extends Command<null>
 */
#[HandledBy(RestoreDockedRecordHandler::class)]
#[Authorize(DockedRecordPolicy::class, DockedRecordAbility::Work)]
#[RetainedActorRequestKey]
final readonly class RestoreDockedRecord extends Command implements HasAuthorizationSubject
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
