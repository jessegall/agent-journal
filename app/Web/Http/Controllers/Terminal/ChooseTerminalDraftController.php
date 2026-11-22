<?php

declare(strict_types=1);

namespace App\Web\Http\Controllers\Terminal;

use App\Http\Requests\Agents\TerminalControlRequest;
use App\Http\Responses\Agents\TerminalAnswers;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

/**
 * A view chooses what becomes of the unsent line in the composer.
 */
final readonly class ChooseTerminalDraftController
{
    public function __invoke(TerminalControlRequest $request, TerminalAnswers $answers): JsonResponse|Response
    {
        return $answers->control($request->chooseCommand());
    }
}
