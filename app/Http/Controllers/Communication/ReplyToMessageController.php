<?php

declare(strict_types=1);

namespace App\Http\Controllers\Communication;

use App\Contracts\CommandBus;
use App\Http\Controllers\Communication\Concerns\AnswersMessageCommands;
use App\Http\Requests\Communication\ReplyToMessageRequest;
use Illuminate\Http\JsonResponse;

final readonly class ReplyToMessageController
{
    use AnswersMessageCommands;

    public function __invoke(ReplyToMessageRequest $request, CommandBus $commands): JsonResponse
    {
        return $this->answerWithNewMessage($commands, $request->command());
    }
}
