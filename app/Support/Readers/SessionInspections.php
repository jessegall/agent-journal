<?php

declare(strict_types=1);

namespace App\Support\Readers;

use App\Models\Sessions\SessionPolicy;
use App\Models\Sessions\StopCheck;
use App\Models\Sessions\StopConditionResult;
use App\Values\SessionInspection;
use App\Values\StopResultLine;

/**
 * Builds a session's inspection from its frozen policy and its last settled stop attempt.
 */
final readonly class SessionInspections
{
    public function of(string $sessionId): SessionInspection
    {
        $policy = SessionPolicy::query()->ofSession($sessionId)->sole();

        return SessionInspection::of($policy, $this->lastStop($sessionId, $policy->stopConditionLabels()));
    }

    /**
     * @param  array<string, string>  $labels
     * @return list<StopResultLine>
     */
    private function lastStop(string $sessionId, array $labels): array
    {
        $attempts = StopCheck::latestSettledOf($sessionId, 1);

        if ($attempts === [] || $labels === []) {
            return [];
        }

        return array_values(array_map(
            fn (StopConditionResult $result) => $result->line($labels[$result->condition_key]),
            $attempts[0]->results()->readExactly(count($labels))->get()->all(),
        ));
    }
}
