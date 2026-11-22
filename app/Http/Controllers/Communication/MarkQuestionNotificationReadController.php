<?php

declare(strict_types=1);

namespace App\Http\Controllers\Communication;

use App\Contracts\CommandBus;
use App\Http\Requests\Communication\MarkQuestionNotificationReadRequest;
use App\Http\Responses\PageActionAnswers;
use Illuminate\Http\RedirectResponse;

/**
 * Marks the actor's receipt of one shown question read and goes back to the page, which reloads its notifications.
 */
final readonly class MarkQuestionNotificationReadController
{
    public function __invoke(
        MarkQuestionNotificationReadRequest $request,
        CommandBus $commands,
        PageActionAnswers $answers,
    ): RedirectResponse {
        $commands->run($request->command());

        return $answers->back();
    }
}
