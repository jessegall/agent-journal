<?php

declare(strict_types=1);

namespace App\Commands\PostChatMessage;

use App\Contracts\Bus\CommandHandler;
use App\Support\ChatPosting;

final readonly class PostChatMessageHandler implements CommandHandler
{
    public function __construct(private ChatPosting $posting) {}

    public function handle(PostChatMessageCommand $command): string
    {
        return $this->posting->post($command);
    }
}
