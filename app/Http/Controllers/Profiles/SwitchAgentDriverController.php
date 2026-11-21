<?php

declare(strict_types=1);

namespace App\Http\Controllers\Profiles;

use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Profiles\SwitchAgentDriverRequest;
use App\Profiles\Values\DriverSwitchReceipt;
use Illuminate\Http\JsonResponse;

/**
 * Switches an agent to another driver, variant or account and answers with where the switch stands.
 */
final readonly class SwitchAgentDriverController
{
    public function __invoke(SwitchAgentDriverRequest $request, CommandBus $commands): JsonResponse
    {
        return self::answer($commands->run($request->command()));
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
