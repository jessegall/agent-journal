<?php

declare(strict_types=1);

namespace App\Http\Controllers\Terminal;

use App\Attributes\Bus\Dispatches;
use App\Commands\Terminals\SendTerminalInput\SendTerminalInputCommand;
use App\Http\Requests\Agents\TerminalControlRequest;
use App\Http\Responses\Agents\TerminalAnswers;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

/**
 * A view sends text or Enter through its grant, at its sequence and for the screen revision it saw.
 */
final readonly class SendTerminalInputController
{
    #[Dispatches(SendTerminalInputCommand::class)]
    public function __invoke(TerminalControlRequest $request, TerminalAnswers $answers): JsonResponse|Response
    {
        return $answers->control($request->inputCommand());
    }
}
