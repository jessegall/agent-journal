<?php

declare(strict_types=1);

namespace App\Http\Controllers\Communication;

use App\Contracts\CommandBus;
use App\Http\Controllers\Communication\Concerns\AnswersMessageCommands;
use App\Http\Requests\Communication\ReleaseMessageClaimRequest;
use Illuminate\Http\JsonResponse;

final readonly class ReleaseMessageClaimController
{
    use AnswersMessageCommands;

    public function __invoke(ReleaseMessageClaimRequest $request, CommandBus $commands): JsonResponse
    {
        return $this->answerWithActedMessage($commands, $request->command());
    }
}
