<?php

declare(strict_types=1);

namespace App\Commands\ClaimSpeech;

use App\Contracts\Bus\CommandHandler;
use App\Support\SpeechService;
use Carbon\CarbonImmutable;

final readonly class ClaimSpeechHandler implements CommandHandler
{
    public function __construct(private SpeechService $speech) {}

    public function handle(ClaimSpeechCommand $command): string
    {
        return $this->speech->claim($command, CarbonImmutable::now());
    }
}
