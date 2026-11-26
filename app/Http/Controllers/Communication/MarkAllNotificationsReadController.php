<?php

declare(strict_types=1);

namespace App\Http\Controllers\Communication;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Communication\MarkAllNotificationsReadRequest;
use App\Http\Responses\PageActionAnswers;
use App\Notifications\Commands\MarkAllNotificationsRead\MarkAllNotificationsReadCommand;
use Illuminate\Http\RedirectResponse;

/**
 * Marks every unread receipt up to the watermark the reader saw, one batch per command so each holds its scope's
 * lock only briefly, and goes back to the page once all are done, which reloads its notifications.
 */
final readonly class MarkAllNotificationsReadController
{
    #[Dispatches(MarkAllNotificationsReadCommand::class)]
    public function __invoke(
        MarkAllNotificationsReadRequest $request,
        CommandBus $commands,
        PageActionAnswers $answers,
    ): RedirectResponse {
        do {
            $isDone = $commands->run($request->command());
        } while (! $isDone);

        return $answers->back();
    }
}
