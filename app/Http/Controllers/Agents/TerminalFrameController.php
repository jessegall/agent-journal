<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents;

use App\Agents\Data\TerminalFrameData;
use App\Agents\Support\TerminalFrames;
use App\Http\Requests\Agents\TerminalFrameRequest;
use App\Http\Responses\Agents\TerminalViewResponses;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

/**
 * Answers the newest frame of an agent's terminal after the one the viewer holds, or 204 when there is none.
 */
final readonly class TerminalFrameController
{
    public function __invoke(
        TerminalFrameRequest $request,
        TerminalFrames $frames,
        TerminalViewResponses $responses,
    ): Response {
        return $responses->answer($request->agentId(), fn (): Response => $frames
            ->after($request->agentId(), $request->heldEpoch(), $request->heldSequence())
            ->map(fn (TerminalFrameData $frame): Response => new JsonResponse($frame))
            ->getOrCall(fn () => new Response(status: Response::HTTP_NO_CONTENT)));
    }
}
