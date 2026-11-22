<?php

declare(strict_types=1);

namespace App\Http\Controllers\Profiles;

use App\Contracts\Bus\CommandBus;
use App\Http\Requests\Profiles\StartProfileMainRequest;
use App\Http\Responses\PageActionAnswers;
use Illuminate\Http\RedirectResponse;

/**
 * Starts a main agent from a profile that coordinates the journal's work. A page's form returns to that page with the
 * started session's id flashed, so the form waits for that session.
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
        PageActionAnswers $answers,
    ): RedirectResponse {
        $receipt = $commands->run($request->command());

        return $answers->backWith(self::STARTED_SESSION, $receipt->sessionId);
    }
}
