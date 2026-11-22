<?php

declare(strict_types=1);

namespace App\Web\Http\Controllers\Terminal;

use App\Http\Requests\Agents\TerminalControlRequest;
use App\Http\Responses\Agents\TerminalAnswers;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

/**
 * A view asks the host to look at the screen again, as after an uncertain write.
 */
final readonly class CheckTerminalScreenController
{
    public function __invoke(TerminalControlRequest $request, TerminalAnswers $answers): JsonResponse|Response
    {
        return $answers->control($request->checkCommand());
    }
}
