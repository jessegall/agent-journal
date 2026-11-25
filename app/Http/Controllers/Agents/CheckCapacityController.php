<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents;

use App\Enums\Sessions\StartRefusalType;
use App\Http\Requests\Agents\CheckCapacityRequest;
use App\Models\Agents\Agent;
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
        $checkedAgent = Agent::query()->findOrFail($agent);
        $shortage = $check->shortageFor($checkedAgent, $request->mode(), $request->budgets());

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
