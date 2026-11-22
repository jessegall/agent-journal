<?php

declare(strict_types=1);

namespace App\Http\Controllers\Terminal;

use App\Http\Requests\Agents\TerminalViewRequest;
use App\Http\Responses\Agents\TerminalAnswers;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

/**
 * A view opens its own read interest in the agent's terminal and gets it back as JSON; a retried request gets the
 * interest it opened first.
 */
final readonly class OpenTerminalController
{
    public function __invoke(TerminalViewRequest $request, TerminalAnswers $answers): JsonResponse|Response
    {
        return $answers->interest($request->openCommand());
    }
}
