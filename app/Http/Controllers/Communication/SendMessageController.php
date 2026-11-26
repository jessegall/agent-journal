<?php

declare(strict_types=1);

namespace App\Http\Controllers\Communication;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Http\Controllers\Communication\Concerns\AnswersMessageCommands;
use App\Http\Requests\Communication\SendMessageRequest;
use App\Messages\Commands\SendMessage\SendMessageCommand;
use Illuminate\Http\JsonResponse;

final readonly class SendMessageController
{
    use AnswersMessageCommands;

    #[Dispatches(SendMessageCommand::class)]
    public function __invoke(SendMessageRequest $request, CommandBus $commands): JsonResponse
    {
        return $this->answerWithNewMessage($commands, $request->command());
    }
}
