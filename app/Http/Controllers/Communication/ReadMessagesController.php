<?php

declare(strict_types=1);

namespace App\Http\Controllers\Communication;

use App\Contracts\CommandBus;
use App\Http\Controllers\Communication\Concerns\AnswersMessageCommands;
use App\Http\Requests\Communication\ReadMessagesRequest;
use Illuminate\Http\JsonResponse;

final readonly class ReadMessagesController
{
    use AnswersMessageCommands;

    public function __invoke(ReadMessagesRequest $request, CommandBus $commands): JsonResponse
    {
        return $this->answerWithResult($commands, $request->command());
    }
}
