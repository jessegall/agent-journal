<?php

declare(strict_types=1);

namespace App\Communication\Handlers;

use App\Communication\Commands\AnswerChatQuestion;
use App\Communication\Support\ChatPosting;
use App\Contracts\CommandHandler;

final readonly class AnswerChatQuestionHandler implements CommandHandler
{
    public function __construct(private ChatPosting $posting) {}

    public function handle(AnswerChatQuestion $command): string
    {
        return $this->posting->answer($command);
    }
}
