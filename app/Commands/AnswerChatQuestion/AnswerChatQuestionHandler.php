<?php

declare(strict_types=1);

namespace App\Commands\AnswerChatQuestion;

use App\Contracts\Bus\CommandHandler;
use App\Support\ChatPosting;

final readonly class AnswerChatQuestionHandler implements CommandHandler
{
    public function __construct(private ChatPosting $posting) {}

    public function handle(AnswerChatQuestionCommand $command): string
    {
        return $this->posting->answer($command);
    }
}
