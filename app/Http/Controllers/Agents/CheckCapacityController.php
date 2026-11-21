<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents;

use App\Agents\Enums\StartRefusalType;
use App\Agents\Models\Agent;
use App\Agents\Support\CapacityCheck;
use App\Agents\Support\StartRemedyWords;
use App\Http\Requests\Agents\CheckCapacityRequest;
use Illuminate\Http\JsonResponse;

/**
 * Check capacity: whether a start of the agent with these choices would fit the host now, or which resource it lacks,
 * in the words of the capacity refusal. It reserves nothing and starts nothing.
 */
final readonly class CheckCapacityController
{
    public function __invoke(
        CheckCapacityRequest $request,
        string $agent,
        CapacityCheck $check,
        StartRemedyWords $words,
    ): JsonResponse {
        $shortage = $check->shortageFor(Agent::query()->findOrFail($agent), $request->mode(), $request->budgets());

        if ($shortage === null) {
            return new JsonResponse(['fits' => true]);
        }

        return new JsonResponse([
            'fits' => false,
            'resource' => $shortage->value,
            'explanation' => $shortage->explanation(),
            'remedy' => $words->textOf(StartRefusalType::CapacityUnavailable->remedy()),
        ]);
    }
}
