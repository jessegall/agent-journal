<?php

declare(strict_types=1);

namespace App\Commands\ReleaseSpeech;

use App\Contracts\Bus\CommandHandler;
use App\Support\SpeechAllowance;

final readonly class ReleaseSpeechHandler implements CommandHandler
{
    public function __construct(private SpeechAllowance $speech) {}

    public function handle(ReleaseSpeechCommand $command): void
    {
        $this->speech->release($command->inboxId, $command->dispatchedBy(), $command->rootId);
    }
}
