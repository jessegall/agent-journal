<?php

declare(strict_types=1);

namespace App\Http\Controllers\Communication;

use App\Attributes\Bus\Dispatches;
use App\Commands\Notifications\MarkTargetNotificationRead\MarkTargetNotificationReadCommand;
use App\Contracts\Bus\CommandBus;
use App\Http\Requests\Communication\MarkTargetNotificationReadRequest;
use App\Http\Responses\PageActionAnswers;
use Illuminate\Http\RedirectResponse;

/**
 * Marks the actor's receipt of one shown target, such as a report, read and goes back to the page, which reloads
 * its notifications.
 */
final readonly class MarkTargetNotificationReadController
{
    #[Dispatches(MarkTargetNotificationReadCommand::class)]
    public function __invoke(
        MarkTargetNotificationReadRequest $request,
        CommandBus $commands,
        PageActionAnswers $answers,
    ): RedirectResponse {
        $commands->run($request->command());

        return $answers->back();
    }
}
