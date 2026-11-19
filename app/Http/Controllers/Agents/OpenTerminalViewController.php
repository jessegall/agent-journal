<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents;

use App\Agents\Support\TerminalViewReceipt;
use App\Http\Requests\Agents\TerminalViewRequest;
use App\Http\Responses\Agents\TerminalViewResponses;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

/**
 * Opens the viewer's read-only view of an agent's terminal and answers the view's receipt.
 */
final readonly class OpenTerminalViewController
{
    public function __invoke(TerminalViewRequest $request, TerminalViewResponses $responses): Response
    {
        return $responses->run(
            $request->agentId(),
            $request->openCommand(),
            fn (TerminalViewReceipt $receipt): JsonResponse => new JsonResponse($receipt),
        );
    }
}
