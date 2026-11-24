<?php

declare(strict_types=1);

namespace App\Commands\Messages\ReplyInChat;

use App\Contracts\Bus\CommandHandler;
use App\Support\ChatService;

final readonly class ReplyInChatHandler implements CommandHandler
{
    public function __construct(private ChatService $posting) {}

    public function handle(ReplyInChatCommand $command): string
    {
        return $this->posting->reply($command);
    }
}
