<?php

declare(strict_types=1);

namespace App\Communication\Handlers;

use App\Communication\Commands\ClaimSpeech;
use App\Communication\Support\SpeechAllowance;
use App\Contracts\CommandHandler;
use Carbon\CarbonImmutable;

final readonly class ClaimSpeechHandler implements CommandHandler
{
    public function __construct(private SpeechAllowance $speech) {}

    public function handle(ClaimSpeech $command): string
    {
        return $this->speech->claim(
            $command->inboxId,
            $command->dispatchedBy(),
            $command->rootId,
            CarbonImmutable::now(),
        );
    }
}
