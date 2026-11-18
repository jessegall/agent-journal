<?php

declare(strict_types=1);

namespace App\Processes\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Processes\Commands\VerifyRestoredOutput;
use Illuminate\Http\JsonResponse;

/**
 * Checks a run's restored output against its original checksums; only a user may.
 */
final readonly class RestoreCheckController
{
    public function __invoke(string $processRun, CommandBus $commands): JsonResponse
    {
        return new JsonResponse(['capture' => $commands->run(new VerifyRestoredOutput($processRun))]);
    }
}
