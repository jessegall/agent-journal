<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents;

use App\Contracts\CommandBus;
use App\Http\Requests\Agents\StopAgentRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;
use Inertia\ResponseFactory;

/**
 * Stops the session the caller saw: a page's form returns to that page with the stop request's id flashed, so the bar
 * follows that stop; a JSON caller reads the request id and its version.
 */
final readonly class StopAgentController
{
    /**
     * The flash key a form reads the stop request's id from.
     */
    public const string STOP_REQUEST = 'stopRequestId';

    public function __invoke(
        StopAgentRequest $request,
        string $agent,
        CommandBus $commands,
        ResponseFactory $inertia,
        Redirector $redirect,
    ): JsonResponse|RedirectResponse {
        $receipt = $commands->run($request->command($agent));

        if (! $request->expectsJson()) {
            $inertia->flash(self::STOP_REQUEST, $receipt->requestId);

            return $redirect->back(303);
        }

        return new JsonResponse(['requestId' => $receipt->requestId, 'version' => $receipt->sequence]);
    }
}
