<?php

declare(strict_types=1);

namespace App\Commands\AskMessage;

use App\Contracts\Bus\CommandHandler;
use App\Support\MessageSending;

final readonly class AskMessageHandler implements CommandHandler
{
    public function __construct(private MessageSending $sending) {}

    public function handle(AskMessageCommand $command): string
    {
        return $this->sending->ask($command);
    }
}
