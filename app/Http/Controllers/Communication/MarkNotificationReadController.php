<?php

declare(strict_types=1);

namespace App\Http\Controllers\Communication;

use App\Contracts\Bus\CommandBus;
use App\Http\Requests\Communication\MarkNotificationReadRequest;
use App\Http\Responses\PageActionAnswers;
use Illuminate\Http\RedirectResponse;

/**
 * Marks one receipt read and goes back to the page, which reloads its notifications with the server's count.
 */
final readonly class MarkNotificationReadController
{
    public function __invoke(
        MarkNotificationReadRequest $request,
        CommandBus $commands,
        PageActionAnswers $answers,
    ): RedirectResponse {
        $commands->run($request->command());

        return $answers->back();
    }
}
