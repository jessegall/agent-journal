<?php

declare(strict_types=1);

namespace App\Http\Controllers\Profiles;

use App\Models\DriverSwitch;
use App\Values\DriverSwitchReceipt;
use Illuminate\Http\JsonResponse;

/**
 * Where the switch of a request stands now, for a tab that waits on it.
 */
final readonly class DriverSwitchStageController
{
    public function __invoke(string $requestId): JsonResponse
    {
        $switch = DriverSwitch::query()->where('request_id', strtolower($requestId))->firstOrFail();

        return SwitchAgentDriverController::answer(DriverSwitchReceipt::of($switch));
    }
}
