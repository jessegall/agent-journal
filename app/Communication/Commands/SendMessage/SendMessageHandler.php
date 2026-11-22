<?php

declare(strict_types=1);

namespace App\Communication\Commands\SendMessage;

use App\Communication\Support\MessageSending;
use App\Contracts\CommandHandler;

final readonly class SendMessageHandler implements CommandHandler
{
    public function __construct(private MessageSending $sending) {}

    public function handle(SendMessageCommand $command): string
    {
        return $this->sending->send($command);
    }
}
