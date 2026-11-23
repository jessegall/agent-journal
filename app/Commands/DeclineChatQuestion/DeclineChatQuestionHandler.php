<?php

declare(strict_types=1);

namespace App\Commands\DeclineChatQuestion;

use App\Contracts\Bus\CommandHandler;
use App\Support\ChatService;

final readonly class DeclineChatQuestionHandler implements CommandHandler
{
    public function __construct(private ChatService $posting) {}

    public function handle(DeclineChatQuestionCommand $command): void
    {
        $this->posting->decline($command);
    }
}
