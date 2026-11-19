<?php

declare(strict_types=1);

namespace App\Agents\Values;

use App\Agents\Exceptions\StopConditionsInvalid;

/**
 * The ordered stop conditions of one launch, checked before it starts: at most 16, each within 60 seconds and 64 KiB,
 * all together within the attempt's time, and a writing helper's always holding clean-worktree.
 */
final readonly class StopConditions
{
    public const int DEFAULT_ATTEMPT_SECONDS = 30;

    public const int MOST_CONDITION_SECONDS = 60;

    public const int MOST_ATTEMPT_SECONDS = 120;

    public const int MOST_CONDITIONS = 16;

    public const int SUMMARY_BYTES = 2048;

    /**
     * @param  list<StopCondition>  $conditions
     */
    private function __construct(
        public array $conditions,
        public int $attemptSeconds,
    ) {}

    /**
     * @param  list<StopCondition>  $conditions
     *
     * @throws StopConditionsInvalid
     */
    public static function make(array $conditions, int $attemptSeconds = self::DEFAULT_ATTEMPT_SECONDS): self
    {
        if (count($conditions) > self::MOST_CONDITIONS) {
            throw StopConditionsInvalid::tooMany(count($conditions));
        }

        if ($attemptSeconds < 1 || $attemptSeconds > self::MOST_ATTEMPT_SECONDS) {
            throw StopConditionsInvalid::attemptTime($attemptSeconds);
        }

        $keys = [];

        foreach ($conditions as $condition) {
            self::check($condition, $keys);
            $keys[] = $condition->key;
        }

        if (array_sum(
            array_map(fn (StopCondition $condition): int => $condition->timeoutSeconds, $conditions),
        ) > $attemptSeconds) {
            throw StopConditionsInvalid::overAttempt($attemptSeconds);
        }

        return new self($conditions, $attemptSeconds);
    }

    /**
     * @param  list<string>  $keys  the keys of the conditions before this one
     *
     * @throws StopConditionsInvalid
     */
    private static function check(StopCondition $condition, array $keys): void
    {
        if (in_array($condition->key, $keys, true)) {
            throw StopConditionsInvalid::repeatedKey($condition->key);
        }

        if (! str_starts_with($condition->executable, '/')) {
            throw StopConditionsInvalid::executableNotAbsolute($condition->key);
        }

        if ($condition->timeoutSeconds < 1 || $condition->timeoutSeconds > self::MOST_CONDITION_SECONDS) {
            throw StopConditionsInvalid::conditionTime($condition->key, $condition->timeoutSeconds);
        }

        if ($condition->outputBytes < 1 || $condition->outputBytes > StopCondition::OUTPUT_BYTES) {
            throw StopConditionsInvalid::output($condition->key, $condition->outputBytes);
        }
    }
}
