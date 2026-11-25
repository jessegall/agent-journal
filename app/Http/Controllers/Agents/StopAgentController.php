<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents;

use App\Attributes\Bus\Dispatches;
use App\Commands\Agents\StopAgent\StopAgentCommand;
use App\Contracts\Bus\CommandBus;
use App\Http\Requests\Agents\StopAgentRequest;
use App\Http\Responses\PageActionAnswers;
use Illuminate\Http\RedirectResponse;

/**
 * Stops the session the caller saw: a page's form returns to that page with the stop request's id flashed, so the bar
 * follows that stop.
 */
final readonly class StopAgentController
{
    /**
     * The flash key a form reads the stop request's id from.
     */
    public const string STOP_REQUEST = 'stopRequestId';

    #[Dispatches(StopAgentCommand::class)]
    public function __invoke(
        StopAgentRequest $request,
        string $agent,
        CommandBus $commands,
        PageActionAnswers $answers,
    ): RedirectResponse {
        $receipt = $commands->run($request->command($agent));

        return $answers->backWith(self::STOP_REQUEST, $receipt->requestId);
    }
}
