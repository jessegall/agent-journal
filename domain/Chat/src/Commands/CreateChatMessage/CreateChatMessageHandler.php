<?php

declare(strict_types=1);

namespace Domain\Chat\Commands\CreateChatMessage;

use App\Contracts\Records\AuthoredRecord;
use App\Contracts\Time\ServerClock;
use Domain\Chat\Commands\Support\ChatCommandHandler;
use Domain\Chat\Exceptions\ChatSourceRefused;
use Domain\Chat\Models\ChatMessage;
use Illuminate\Database\Eloquent\Relations\Relation;

/**
 * Finds the record by its alias in the morph map and records it in the inbox's chat.
 */
final readonly class CreateChatMessageHandler extends ChatCommandHandler
{
    public function __construct(private ServerClock $clock) {}

    /**
     * @throws ChatSourceRefused
     */
    public function handle(CreateChatMessageCommand $command): string
    {
        $model = Relation::getMorphedModel($command->sourceType) ?? throw ChatSourceRefused::unknownType($command->sourceType);
        $source = $model::query()->findOrFail($command->sourceId);

        if (! $source instanceof AuthoredRecord) {
            throw ChatSourceRefused::notAuthored($command->sourceType);
        }

        return ChatMessage::record($command->inboxId, $source, $command->type, $this->clock->now())->id;
    }
}
