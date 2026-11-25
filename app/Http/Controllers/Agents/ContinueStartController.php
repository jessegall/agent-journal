<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents;

use App\Attributes\Bus\Dispatches;
use App\Commands\Agents\ContinueStart\ContinueStartCommand;
use App\Contracts\Bus\CommandBus;
use App\Http\Requests\Agents\ContinueStartRequest;
use Illuminate\Http\JsonResponse;

/**
 * Continues a session's start in its one successor, and answers whether this call made it or found it made.
 */
final readonly class ContinueStartController
{
    #[Dispatches(ContinueStartCommand::class)]
    public function __invoke(ContinueStartRequest $request, CommandBus $commands): JsonResponse
    {
        $receipt = $commands->run($request->command());

        return new JsonResponse([
            'sessionId' => $receipt->sessionId,
            'newSession' => $receipt->isNewSession,
            'conversation' => 'new',
        ]);
    }
}
