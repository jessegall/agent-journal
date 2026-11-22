<?php

declare(strict_types=1);

namespace App\Http\Controllers\Communication;

use App\Contracts\Bus\CommandBus;
use App\Http\Controllers\Communication\Concerns\AnswersMessageCommands;
use App\Http\Requests\Communication\SendMessageRequest;
use Illuminate\Http\JsonResponse;

final readonly class SendMessageController
{
    use AnswersMessageCommands;

    public function __invoke(SendMessageRequest $request, CommandBus $commands): JsonResponse
    {
        return $this->answerWithNewMessage($commands, $request->command());
    }
}
