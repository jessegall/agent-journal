<?php

declare(strict_types=1);

namespace App\Commands\ReplyInChat;

use App\Contracts\Bus\CommandHandler;
use App\Support\ChatPosting;

final readonly class ReplyInChatHandler implements CommandHandler
{
    public function __construct(private ChatPosting $posting) {}

    public function handle(ReplyInChatCommand $command): string
    {
        return $this->posting->reply($command);
    }
}
