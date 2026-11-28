<?php

declare(strict_types=1);

namespace App\Http\Controllers\Profiles;

use App\Agents\Commands\ChooseNextStart\ChooseNextStartCommand;
use App\Agents\Commands\SwitchAgentDriver\SwitchAgentDriverCommand;
use App\Agents\Values\DriverSwitchReceipt;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Profiles\SwitchAgentDriverRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Switches an agent to another driver, driver type, account or model. A page's form returns to that page, which shows
 * the switch's stage, with the reason as its error when the switch failed at once. An agent with no session starts
 * nothing: its next message starts it on the choice.
 */
final readonly class SwitchAgentDriverController
{
    #[Dispatches(SwitchAgentDriverCommand::class)]
    #[Dispatches(ChooseNextStartCommand::class)]
    public function __invoke(
        SwitchAgentDriverRequest $request,
        CommandBus $commands,
        Redirector $redirect,
    ): RedirectResponse {
        if (! $request->hasSession()) {
            $commands->run($request->nextStart());

            return $redirect->back(303);
        }

        $receipt = $commands->run($request->command());

        $back = $redirect->back(303);

        if ($receipt->failureReason === null) {
            return $back;
        }

        return $back->withErrors(['switch' => $receipt->failureReason]);
    }

    public static function answer(DriverSwitchReceipt $receipt): JsonResponse
    {
        return new JsonResponse([
            'switchId' => $receipt->switchId,
            'stage' => $receipt->stage->value,
            'stageLabel' => $receipt->stage->label(),
            'isFinal' => $receipt->stage->isFinal(),
            'failureReason' => $receipt->failureReason,
        ]);
    }
}
