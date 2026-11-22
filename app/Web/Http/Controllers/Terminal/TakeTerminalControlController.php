<?php

declare(strict_types=1);

namespace App\Web\Http\Controllers\Terminal;

use App\Http\Requests\Agents\TerminalControlRequest;
use App\Http\Responses\Agents\TerminalAnswers;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

/**
 * A view takes control of the agent's terminal through its read interest; a pending take answers at once and the
 * view learns its grant by asking for the receipt.
 */
final readonly class TakeTerminalControlController
{
    public function __invoke(TerminalControlRequest $request, TerminalAnswers $answers): JsonResponse|Response
    {
        return $answers->control($request->takeCommand());
    }
}
