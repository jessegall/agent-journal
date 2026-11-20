<?php

declare(strict_types=1);

namespace App\Http\Controllers\Communication\Concerns;

use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandBus;
use App\Communication\Contracts\MessageCommand;
use Illuminate\Http\JsonResponse;

/**
 * Runs a message command on the bus and answers in JSON: with the id of the message it made, with the id of the
 * message it acted on, or with what it returned.
 */
trait AnswersMessageCommands
{
    /**
     * @param  Command<string>  $command
     */
    private function answerWithNewMessage(CommandBus $commands, Command $command): JsonResponse
    {
        return new JsonResponse(['messageId' => $commands->run($command)]);
    }

    /**
     * @param  MessageCommand<mixed>  $command
     */
    private function answerWithActedMessage(CommandBus $commands, MessageCommand $command): JsonResponse
    {
        $commands->run($command);

        return new JsonResponse(['messageId' => $command->messageId]);
    }

    /**
     * @param  Command<mixed>  $command
     */
    private function answerWithResult(CommandBus $commands, Command $command): JsonResponse
    {
        return new JsonResponse($commands->run($command));
    }
}
