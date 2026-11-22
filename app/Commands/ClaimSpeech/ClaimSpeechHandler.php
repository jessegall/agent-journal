<?php

declare(strict_types=1);

namespace App\Commands\ClaimSpeech;

use App\Contracts\CommandHandler;
use App\Support\SpeechAllowance;
use Carbon\CarbonImmutable;

final readonly class ClaimSpeechHandler implements CommandHandler
{
    public function __construct(private SpeechAllowance $speech) {}

    public function handle(ClaimSpeechCommand $command): string
    {
        return $this->speech->claim(
            $command->inboxId,
            $command->dispatchedBy(),
            $command->rootId,
            $command->batchId,
            $command->grant,
            CarbonImmutable::now(),
        );
    }
}
