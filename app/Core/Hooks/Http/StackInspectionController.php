<?php

declare(strict_types=1);

namespace App\Core\Hooks\Http;

use App\Core\Hooks\Inspection\StackInspectionQuery;
use App\Core\Agents\Support\StackTarget;
use Illuminate\Http\JsonResponse;

/**
 * Shows a signed-in user one agent's stack and the walk of its last answered call.
 */
final readonly class StackInspectionController
{
    public function __construct(private StackInspectionQuery $inspections) {}

    public function __invoke(int $agentId, int $sessionId): JsonResponse
    {
        return new JsonResponse($this->inspections->forTarget(new StackTarget($agentId, $sessionId))->toArray());
    }
}
