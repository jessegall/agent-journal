<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents;

use App\Agents\Commands\ContinueStart\ContinueStartCommand;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
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
