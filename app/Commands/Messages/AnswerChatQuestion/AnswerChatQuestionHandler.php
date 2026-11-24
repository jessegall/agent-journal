<?php

declare(strict_types=1);

namespace App\Commands\Messages\AnswerChatQuestion;

use App\Contracts\Bus\CommandHandler;
use App\Support\ChatService;

final readonly class AnswerChatQuestionHandler implements CommandHandler
{
    public function __construct(private ChatService $posting) {}

    public function handle(AnswerChatQuestionCommand $command): string
    {
        return $this->posting->answer($command);
    }
}
