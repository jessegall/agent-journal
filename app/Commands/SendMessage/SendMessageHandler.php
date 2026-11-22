<?php

declare(strict_types=1);

namespace App\Commands\SendMessage;

use App\Contracts\Bus\CommandHandler;
use App\Support\MessageSending;

final readonly class SendMessageHandler implements CommandHandler
{
    public function __construct(private MessageSending $sending) {}

    public function handle(SendMessageCommand $command): string
    {
        return $this->sending->send($command);
    }
}
