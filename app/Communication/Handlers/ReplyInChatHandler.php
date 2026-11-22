<?php

declare(strict_types=1);

namespace App\Communication\Handlers;

use App\Communication\Commands\ReplyInChat;
use App\Communication\Support\ChatPosting;
use App\Contracts\CommandHandler;

final readonly class ReplyInChatHandler implements CommandHandler
{
    public function __construct(private ChatPosting $posting) {}

    public function handle(ReplyInChat $command): string
    {
        return $this->posting->reply($command);
    }
}
