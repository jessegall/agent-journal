<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents;

use App\Enums\StartRefusalType;
use App\Http\Requests\Agents\CheckCapacityRequest;
use App\Models\Agent;
use App\Support\CapacityCheck;
use App\Support\StartRemedyWords;

/**
 * Check capacity: whether a start of the agent with these choices would fit the host now, or which resource it lacks,
 * in the words of the capacity refusal. It reserves nothing and starts nothing.
 */
final readonly class CheckCapacityController
{
    /**
     * @return array{fits: bool, resource?: string, explanation?: string, remedy?: string}
     */
    public function __invoke(
        CheckCapacityRequest $request,
        string $agent,
        CapacityCheck $check,
        StartRemedyWords $words,
    ): array {
        $shortage = $check->shortageFor(Agent::query()->findOrFail($agent), $request->mode(), $request->budgets());

        if ($shortage === null) {
            return ['fits' => true];
        }

        return [
            'fits' => false,
            'resource' => $shortage->value,
            'explanation' => $shortage->explanation(),
            'remedy' => $words->textOf(StartRefusalType::CapacityUnavailable->remedy()),
        ];
    }
}
