<?php

declare(strict_types=1);

namespace App\Http\Controllers\Terminal;

use App\Bus\Attributes\Dispatches;
use App\Http\Requests\Agents\TerminalControlRequest;
use App\Http\Responses\Agents\TerminalAnswers;
use App\Terminals\Commands\CheckTerminalScreen\CheckTerminalScreenCommand;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

/**
 * A view asks the host to look at the screen again, as after an uncertain write.
 */
final readonly class CheckTerminalScreenController
{
    #[Dispatches(CheckTerminalScreenCommand::class)]
    public function __invoke(TerminalControlRequest $request, TerminalAnswers $answers): JsonResponse|Response
    {
        return $answers->control($request->checkCommand());
    }
}
