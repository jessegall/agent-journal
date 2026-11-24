<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents;

use App\Commands\Agents\CheckStartStatus\CheckStartStatusCommand;
use App\Contracts\Bus\CommandBus;
use App\Http\Requests\Agents\CheckStartStatusRequest;
use App\Http\Responses\PageActionAnswers;
use Illuminate\Http\RedirectResponse;

final readonly class CheckStartStatusController
{
    /**
     * The flash key that says whether the host was asked to send its ready report again.
     */
    public const string CHECKED = 'startChecked';

    public function __invoke(
        CheckStartStatusRequest $request,
        string $agent,
        string $session,
        CommandBus $commands,
        PageActionAnswers $answers,
    ): RedirectResponse {
        $checked = $commands->run(new CheckStartStatusCommand($agent, $session, $request->requestId()));

        return $answers->backWith(self::CHECKED, $checked);
    }
}
