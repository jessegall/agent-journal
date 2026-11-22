<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents;

use App\Commands\CancelLaunch\CancelLaunchCommand;
use App\Contracts\Bus\CommandBus;
use App\Http\Requests\Agents\CancelLaunchRequest;
use App\Http\Responses\PageActionAnswers;
use Illuminate\Http\RedirectResponse;

/**
 * Cancels a launch still in progress from Home through CancelLaunchCommand and goes back to the page with whether a
 * runtime was told to stop flashed.
 */
final readonly class CancelLaunchController
{
    /**
     * The flash key that says whether the cancel stopped the launch.
     */
    public const string STOPPED = 'launchStopped';

    public function __invoke(
        CancelLaunchRequest $request,
        string $agent,
        string $session,
        CommandBus $commands,
        PageActionAnswers $answers,
    ): RedirectResponse {
        $stopped = $commands->run(new CancelLaunchCommand($agent, $session, $request->requestId()));

        return $answers->backWith(self::STOPPED, $stopped);
    }
}
