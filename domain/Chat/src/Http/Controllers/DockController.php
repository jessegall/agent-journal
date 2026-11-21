<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use Domain\Chat\Commands\DockSource;
use Domain\Chat\Data\DockAnswerData;
use Domain\Chat\Data\DockInput;
use Domain\Chat\Support\DockRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Redirector;
use Inertia\ResponseFactory;

final readonly class DockController
{
    /**
     * The flash key a window's dock offer reads what came of its docking from.
     */
    public const string DOCK_OUTCOME = 'dockOutcome';

    /**
     * Docks the source in the conversation with the agent and answers what came of it: a window's offer gets it as a
     * one-time flash beside the page it shows again, a JSON caller as the answer; a retry under the same key answers
     * the first time.
     */
    public function __invoke(
        DockInput $input,
        Request $request,
        CommandBus $commands,
        DockRequests $requests,
        ResponseFactory $inertia,
        Redirector $redirect,
    ): DockAnswerData|RedirectResponse {
        $conversation = $requests->conversationWith($input->agent);
        $answer = DockAnswerData::fromDockResult(
            $commands->run(new DockSource($conversation->id, $input->type, $input->id, $input->presentation)),
        );

        if ($request->expectsJson()) {
            return $answer;
        }

        $inertia->flash(self::DOCK_OUTCOME, $answer->outcome->value);

        return $redirect->back(303);
    }
}
