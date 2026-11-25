<?php

declare(strict_types=1);

namespace App\Values;

use App\Exceptions\StopConditionsInvalid;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * The ordered stop conditions of one start, checked before it starts: at most 16, each within 60 seconds and 64 KiB,
 * all together within the attempt's time, and a writing helper's always holding clean-worktree.
 */
#[MapName(SnakeCaseMapper::class)]
final class StopConditions extends Data
{
    public const int DEFAULT_ATTEMPT_SECONDS = 30;

    public const int MOST_CONDITION_SECONDS = 60;

    public const int MOST_ATTEMPT_SECONDS = 120;

    public const int MOST_CONDITIONS = 16;

    public const int SUMMARY_BYTES = 2048;

    /**
     * @param  list<StopCondition>  $conditions
     *
     * @throws StopConditionsInvalid
     */
    public function __construct(
        #[DataCollectionOf(StopCondition::class)]
        public readonly array $conditions,
        public readonly int $attemptSeconds = self::DEFAULT_ATTEMPT_SECONDS,
    ) {
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
            array_map(fn (StopCondition $condition) => $condition->timeoutSeconds, $conditions),
        ) > $attemptSeconds) {
            throw StopConditionsInvalid::overAttempt($attemptSeconds);
        }
    }

    public function isEmpty(): bool
    {
        return $this->conditions === [];
    }

    /**
     * Every condition's key with the hash of its definition, in declaration order.
     *
     * @return array<string, string>
     */
    public function definitionHashes(): array
    {
        $hashes = [];

        foreach ($this->conditions as $condition) {
            $hashes[$condition->key] = $condition->definitionHash();
        }

        return $hashes;
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
