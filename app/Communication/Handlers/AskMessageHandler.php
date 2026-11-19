<?php

declare(strict_types=1);

namespace App\Communication\Handlers;

use App\Communication\Commands\AskMessage;
use App\Communication\Support\MessageSending;
use App\Contracts\CommandHandler;

final readonly class AskMessageHandler implements CommandHandler
{
    public function __construct(private MessageSending $sending) {}

    public function handle(AskMessage $command): string
    {
        return $this->sending->ask($command);
    }
}
