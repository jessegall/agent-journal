<?php

declare(strict_types=1);

namespace App\Connections\Http\Controllers;

use App\Agents\Values\HostContext;
use App\Connections\Models\ProjectBinding;
use Illuminate\Http\JsonResponse;

/**
 * Answers the binding's host what the journal holds of the binding now, its effective readiness and last confirmed
 * contact, without recording a report: journal status refreshes from it.
 */
final readonly class BindingStatusController
{
    public function __invoke(string $binding, HostContext $host): JsonResponse
    {
        return new JsonResponse(ProjectBinding::ofHost($host->hostId, $binding)->presenceReceipt()->toArray());
    }
}
