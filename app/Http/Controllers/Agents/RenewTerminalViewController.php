<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents;

use App\Agents\Support\TerminalViewReceipt;
use App\Http\Requests\Agents\TerminalViewRequest;
use App\Http\Responses\Agents\TerminalViewResponses;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

/**
 * Keeps the viewer's view of an agent's terminal live, opening it anew when it lapsed, and answers its receipt.
 */
final readonly class RenewTerminalViewController
{
    public function __invoke(TerminalViewRequest $request, TerminalViewResponses $responses): Response
    {
        return $responses->run(
            $request->agentId(),
            $request->renewCommand(),
            fn (TerminalViewReceipt $receipt): JsonResponse => new JsonResponse($receipt),
        );
    }
}
