<?php

declare(strict_types=1);

namespace App\Commands\DeclineChatQuestion;

use App\Contracts\Bus\CommandHandler;
use App\Support\ChatPosting;

final readonly class DeclineChatQuestionHandler implements CommandHandler
{
    public function __construct(private ChatPosting $posting) {}

    public function handle(DeclineChatQuestionCommand $command): void
    {
        $this->posting->decline($command);
    }
}
