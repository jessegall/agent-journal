<?php

declare(strict_types=1);

namespace App\Http\Controllers\Hooks;

use App\Agents\Support\StackTarget;
use App\Hooks\Contracts\StackInspectionQuery;
use Illuminate\Http\JsonResponse;

/**
 * Shows a signed-in user one agent's stack and the walk of its last answered call.
 */
final readonly class StackInspectionController
{
    public function __construct(private StackInspectionQuery $inspections) {}

    public function __invoke(string $agentId, string $sessionId): JsonResponse
    {
        return new JsonResponse($this->inspections->forTarget(new StackTarget($agentId, $sessionId))->toArray());
    }
}
