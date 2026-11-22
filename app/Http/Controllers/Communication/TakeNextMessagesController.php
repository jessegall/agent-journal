<?php

declare(strict_types=1);

namespace App\Http\Controllers\Communication;

use App\Contracts\CommandBus;
use App\Http\Controllers\Communication\Concerns\AnswersMessageCommands;
use App\Http\Requests\Communication\TakeNextMessagesRequest;
use Illuminate\Http\JsonResponse;

final readonly class TakeNextMessagesController
{
    use AnswersMessageCommands;

    public function __invoke(TakeNextMessagesRequest $request, CommandBus $commands): JsonResponse
    {
        return $this->answerWithResult($commands, $request->command());
    }
}
