<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents;

use App\Attributes\Bus\Dispatches;
use App\Commands\Sessions\DismissSessionStartOutcome\DismissSessionStartOutcomeCommand;
use App\Contracts\Bus\CommandBus;
use App\Http\Requests\Agents\DismissSessionStartOutcomeRequest;
use App\Http\Responses\PageActionAnswers;
use Illuminate\Http\RedirectResponse;

/**
 * Hides one version of an agent's start outcome from the user who dismisses it.
 */
final readonly class DismissSessionStartOutcomeController
{
    #[Dispatches(DismissSessionStartOutcomeCommand::class)]
    public function __invoke(
        DismissSessionStartOutcomeRequest $request,
        string $agent,
        CommandBus $commands,
        PageActionAnswers $answers,
    ): RedirectResponse {
        $commands->run($request->command($agent));

        return $answers->back();
    }
}
