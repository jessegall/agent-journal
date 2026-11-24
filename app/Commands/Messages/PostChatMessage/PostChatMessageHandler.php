<?php

declare(strict_types=1);

namespace App\Commands\Messages\PostChatMessage;

use App\Contracts\Bus\CommandHandler;
use App\Support\ChatService;

final readonly class PostChatMessageHandler implements CommandHandler
{
    public function __construct(private ChatService $posting) {}

    public function handle(PostChatMessageCommand $command): string
    {
        return $this->posting->post($command);
    }
}
