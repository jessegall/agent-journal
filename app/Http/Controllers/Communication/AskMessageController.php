<?php

declare(strict_types=1);

namespace App\Http\Controllers\Communication;

use App\Bus\Contracts\CommandBus;
use App\Http\Controllers\Communication\Concerns\AnswersMessageCommands;
use App\Http\Requests\Communication\AskMessageRequest;
use Illuminate\Http\JsonResponse;

final readonly class AskMessageController
{
    use AnswersMessageCommands;

    public function __invoke(AskMessageRequest $request, CommandBus $commands): JsonResponse
    {
        return $this->answerWithNewMessage($commands, $request->command());
    }
}
