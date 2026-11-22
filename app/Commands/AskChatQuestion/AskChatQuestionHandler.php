<?php

declare(strict_types=1);

namespace App\Commands\AskChatQuestion;

use App\Contracts\Bus\CommandHandler;
use App\Support\ChatPosting;

final readonly class AskChatQuestionHandler implements CommandHandler
{
    public function __construct(private ChatPosting $posting) {}

    public function handle(AskChatQuestionCommand $command): string
    {
        return $this->posting->ask($command);
    }
}
