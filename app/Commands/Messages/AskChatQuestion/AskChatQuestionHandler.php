<?php

declare(strict_types=1);

namespace App\Commands\Messages\AskChatQuestion;

use App\Contracts\Bus\CommandHandler;
use App\Support\ChatService;

final readonly class AskChatQuestionHandler implements CommandHandler
{
    public function __construct(private ChatService $posting) {}

    public function handle(AskChatQuestionCommand $command): string
    {
        return $this->posting->ask($command);
    }
}
