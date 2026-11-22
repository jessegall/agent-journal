<?php

declare(strict_types=1);

namespace App\Http\Controllers\Terminal;

use App\Http\Requests\Agents\TerminalFrameRequest;
use App\Http\Responses\Agents\TerminalAnswers;
use App\Support\TerminalFrames;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

/**
 * What a view's read interest should see after the frame it holds, as JSON, with inspect decided on every read.
 */
final readonly class TerminalFrameController
{
    public function __invoke(
        TerminalFrameRequest $request,
        TerminalFrames $frames,
        TerminalAnswers $answers,
    ): JsonResponse|Response {
        return $answers->answer(fn () => $frames->after($request->agentId(), $request->heldFrame()));
    }
}
