<?php

declare(strict_types=1);

namespace App\Communication\Commands\DeclineChatQuestion;

use App\Communication\Support\ChatPosting;
use App\Contracts\CommandHandler;

final readonly class DeclineChatQuestionHandler implements CommandHandler
{
    public function __construct(private ChatPosting $posting) {}

    public function handle(DeclineChatQuestionCommand $command): void
    {
        $this->posting->decline($command);
    }
}
