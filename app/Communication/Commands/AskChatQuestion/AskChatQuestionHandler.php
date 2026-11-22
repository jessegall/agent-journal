<?php

declare(strict_types=1);

namespace App\Communication\Commands\AskChatQuestion;

use App\Communication\Support\ChatPosting;
use App\Contracts\CommandHandler;

final readonly class AskChatQuestionHandler implements CommandHandler
{
    public function __construct(private ChatPosting $posting) {}

    public function handle(AskChatQuestionCommand $command): string
    {
        return $this->posting->ask($command);
    }
}
