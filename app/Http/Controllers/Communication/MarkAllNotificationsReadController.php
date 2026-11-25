<?php

declare(strict_types=1);

namespace App\Http\Controllers\Communication;

use App\Attributes\Bus\Dispatches;
use App\Commands\Notifications\MarkAllNotificationsRead\MarkAllNotificationsReadCommand;
use App\Contracts\Bus\CommandBus;
use App\Http\Requests\Communication\MarkAllNotificationsReadRequest;
use App\Http\Responses\PageActionAnswers;
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
