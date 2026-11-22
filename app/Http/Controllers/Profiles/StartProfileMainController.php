<?php

declare(strict_types=1);

namespace App\Http\Controllers\Profiles;

use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Profiles\StartProfileMainRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;
use Inertia\ResponseFactory;

/**
 * Starts a main agent from a profile that coordinates the journal's work. A page's form returns to that page with the
 * started session's id flashed, so the form waits for that session; a JSON caller reads the session, driver and
 * model.
 */
final readonly class StartProfileMainController
{
    /**
     * The flash key a form reads the started session's id from.
     */
    public const string STARTED_SESSION = 'startedSessionId';

    public function __invoke(
        StartProfileMainRequest $request,
        CommandBus $commands,
        ResponseFactory $inertia,
        Redirector $redirect,
    ): JsonResponse|RedirectResponse {
        $receipt = $commands->run($request->command());

        if (! $request->expectsJson()) {
            $inertia->flash(self::STARTED_SESSION, $receipt->sessionId);

            return $redirect->back(303);
        }

        return new JsonResponse([
            'sessionId' => $receipt->sessionId,
            'newSession' => $receipt->newSession,
            'driverArguments' => $receipt->driverArguments,
        ]);
    }
}
