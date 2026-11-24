<?php

declare(strict_types=1);

namespace App\Commands\Messages\AskMessage;

use App\Contracts\Bus\CommandHandler;
use App\Support\MessageService;

final readonly class AskMessageHandler implements CommandHandler
{
    public function __construct(private MessageService $messages) {}

    public function handle(AskMessageCommand $command): string
    {
        return $this->messages->ask($command);
    }
}
