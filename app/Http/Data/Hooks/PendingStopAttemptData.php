<?php

declare(strict_types=1);

namespace App\Http\Data\Hooks;

use App\Agents\Values\StartPolicy;
use App\Agents\Values\StopCondition;
use App\Hooks\Models\StopAttempt;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * A stop attempt waiting for the host: the session it stops, what its results must name and the conditions to run in
 * declaration order within the attempt's time.
 */
#[MapName(SnakeCaseMapper::class)]
final class PendingStopAttemptData extends Data
{
    /**
     * @param  list<StopConditionRunData>  $conditions
     */
    public function __construct(
        public string $id,
        public string $sessionId,
        public string $policyDigest,
        public int $workspaceGeneration,
        public int $attemptSeconds,
        #[DataCollectionOf(StopConditionRunData::class)]
        public array $conditions,
    ) {}

    public static function of(StopAttempt $attempt, StartPolicy $policy): self
    {
        return new self(
            $attempt->id,
            $attempt->session_id,
            $attempt->policy_digest,
            $attempt->workspace_generation,
            $policy->stopConditions->attemptSeconds,
            array_map(
                fn (StopCondition $condition) => StopConditionRunData::fromStopCondition($condition),
                $policy->stopConditions->conditions,
            ),
        );
    }
}
