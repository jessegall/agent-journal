<?php

declare(strict_types=1);

namespace Domain\Chat\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Contracts\RecordCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Chat\Handlers\UndockSourceHandler;
use Domain\Chat\Models\Conversation;
use Domain\Chat\Policies\ConversationPolicy;
use Domain\Chat\Values\DockResult;

/**
 * Undocks one placement from a conversation the actor takes part in, when it still docks the source named.
 *
 * @extends Command<DockResult>
 */
#[RetainedActorRequestKey]
#[HandledBy(UndockSourceHandler::class)]
#[Authorize(ConversationPolicy::class, AccessType::Edit)]
final readonly class UndockSource extends Command implements RecordCommand
{
    public function __construct(
        public string $conversationId,
        public string $placementId,
        public string $type,
        public string $id,
    ) {}

    public function subject(): Conversation
    {
        return Conversation::lockedById($this->conversationId);
    }
}
