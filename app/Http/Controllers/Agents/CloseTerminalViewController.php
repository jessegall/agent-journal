<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents;

use App\Http\Requests\Agents\TerminalViewRequest;
use App\Http\Responses\Agents\TerminalViewResponses;
use Symfony\Component\HttpFoundation\Response;

/**
 * Ends the viewer's view of an agent's terminal; other viewers keep theirs.
 */
final readonly class CloseTerminalViewController
{
    public function __invoke(TerminalViewRequest $request, TerminalViewResponses $responses): Response
    {
        return $responses->run(
            $request->agentId(),
            $request->closeCommand(),
            fn (): Response => new Response(status: Response::HTTP_NO_CONTENT),
        );
    }
}
