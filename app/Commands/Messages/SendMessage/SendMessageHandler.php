<?php

declare(strict_types=1);

namespace App\Commands\Messages\SendMessage;

use App\Contracts\Bus\CommandHandler;
use App\Support\MessageService;

final readonly class SendMessageHandler implements CommandHandler
{
    public function __construct(private MessageService $messages) {}

    public function handle(SendMessageCommand $command): string
    {
        return $this->messages->send($command);
    }
}
