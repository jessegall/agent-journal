<?php

declare(strict_types=1);

namespace Domain\Chat\Commands\React;

use App\Commands\Messages\SendMessage\SendMessageCommand;
use App\Contracts\Bus\CommandBus;
use App\Models\Messages\Message;
use Domain\Chat\Commands\Support\ChatCommandHandler;
use Domain\Chat\Exceptions\ReactionRefused;
use Domain\Chat\Support\Emoji;

final readonly class ReactHandler extends ChatCommandHandler
{
    public function __construct(private CommandBus $commands) {}

    /**
     * @throws ReactionRefused
     */
    public function handle(ReactCommand $command): string
    {
        if (! Emoji::isOne($command->emoji)) {
            throw ReactionRefused::notOneEmoji();
        }

        $message = Message::query()->findOrFail($command->messageId);

        return $this->commands->run(new SendMessageCommand($message->inbox_id, $command->emoji, $message->number));
    }
}
