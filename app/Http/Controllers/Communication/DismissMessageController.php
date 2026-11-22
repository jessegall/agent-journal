<?php

declare(strict_types=1);

namespace App\Http\Controllers\Communication;

use App\Contracts\CommandBus;
use App\Http\Controllers\Communication\Concerns\AnswersMessageCommands;
use App\Http\Requests\Communication\DismissMessageRequest;
use Illuminate\Http\JsonResponse;

final readonly class DismissMessageController
{
    use AnswersMessageCommands;

    public function __invoke(DismissMessageRequest $request, CommandBus $commands): JsonResponse
    {
        return $this->answerWithActedMessage($commands, $request->command());
    }
}
