<?php

declare(strict_types=1);

namespace App\Http\Controllers\Terminal;

use App\Http\Requests\Agents\TerminalControlRequest;
use App\Http\Responses\Agents\TerminalAnswers;
use App\Terminals\TerminalFrames;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

/**
 * A view's take as it stands: the grant once the host issued it, and what became of the input at a sequence.
 */
final readonly class TerminalControlReceiptController
{
    public function __invoke(
        TerminalControlRequest $request,
        TerminalFrames $frames,
        TerminalAnswers $answers,
    ): JsonResponse|Response {
        return $answers->answer(fn () => $frames->control($request->takeId(), $request->sequence()));
    }
}
