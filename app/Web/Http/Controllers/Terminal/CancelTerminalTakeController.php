<?php

declare(strict_types=1);

namespace App\Web\Http\Controllers\Terminal;

use App\Http\Requests\Agents\TerminalControlRequest;
use App\Http\Responses\Agents\TerminalAnswers;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

/**
 * A view cancels its take; a grant the take issued is released.
 */
final readonly class CancelTerminalTakeController
{
    public function __invoke(TerminalControlRequest $request, TerminalAnswers $answers): JsonResponse|Response
    {
        return $answers->control($request->cancelCommand());
    }
}
