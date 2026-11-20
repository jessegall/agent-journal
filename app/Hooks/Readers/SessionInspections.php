<?php

declare(strict_types=1);

namespace App\Hooks\Readers;

use App\Agents\Models\SessionPolicy;
use App\Hooks\Models\StopAttempt;
use App\Hooks\Models\StopResult;
use App\Hooks\Values\SessionInspection;
use App\Hooks\Values\StopResultLine;

/**
 * Builds a session's inspection from its frozen policy and its last settled stop attempt.
 */
final readonly class SessionInspections
{
    public function of(string $sessionId): SessionInspection
    {
        $policy = SessionPolicy::query()->where('session_id', $sessionId)->sole();

        return SessionInspection::of($policy, $this->lastStop($sessionId, $policy->stopConditionLabels()));
    }

    /**
     * @param  array<string, string>  $labels
     * @return list<StopResultLine>
     */
    private function lastStop(string $sessionId, array $labels): array
    {
        $attempts = StopAttempt::latestSettledOf($sessionId, 1);

        if ($attempts === [] || $labels === []) {
            return [];
        }

        return array_values(array_map(
            fn (StopResult $result) => $result->line($labels[$result->condition_key]),
            $attempts[0]->results()->readLimit(count($labels))->get()->all(),
        ));
    }
}
