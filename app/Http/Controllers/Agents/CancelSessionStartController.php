<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents;

use App\Agents\Commands\CancelSessionStart\CancelSessionStartCommand;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Agents\CancelSessionStartRequest;
use App\Http\Responses\PageActionAnswers;
use Illuminate\Http\RedirectResponse;

/**
 * Cancels a start still in progress from Home through CancelSessionStartCommand and goes back to the page with whether a
 * runtime was told to stop flashed.
 */
final readonly class CancelSessionStartController
{
    /**
     * The flash key that says whether the cancel stopped the start.
     */
    public const string STOPPED = 'startStopped';

    #[Dispatches(CancelSessionStartCommand::class)]
    public function __invoke(
        CancelSessionStartRequest $request,
        string $agent,
        string $session,
        CommandBus $commands,
        PageActionAnswers $answers,
    ): RedirectResponse {
        $stopped = $commands->run(new CancelSessionStartCommand($agent, $session, $request->requestId()));

        return $answers->backWith(self::STOPPED, $stopped);
    }
}
