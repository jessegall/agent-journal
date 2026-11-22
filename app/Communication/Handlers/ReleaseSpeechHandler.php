<?php

declare(strict_types=1);

namespace App\Communication\Handlers;

use App\Communication\Commands\ReleaseSpeech;
use App\Communication\Support\SpeechAllowance;
use App\Contracts\CommandHandler;

final readonly class ReleaseSpeechHandler implements CommandHandler
{
    public function __construct(private SpeechAllowance $speech) {}

    public function handle(ReleaseSpeech $command): void
    {
        $this->speech->release($command->inboxId, $command->dispatchedBy(), $command->rootId);
    }
}
