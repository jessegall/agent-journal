<?php

declare(strict_types=1);

namespace App\Communication\Commands\PostChatMessage;

use App\Communication\Support\ChatPosting;
use App\Contracts\CommandHandler;

final readonly class PostChatMessageHandler implements CommandHandler
{
    public function __construct(private ChatPosting $posting) {}

    public function handle(PostChatMessageCommand $command): string
    {
        return $this->posting->post($command);
    }
}
