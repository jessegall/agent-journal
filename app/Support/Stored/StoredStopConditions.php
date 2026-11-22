<?php

declare(strict_types=1);

namespace App\Support\Stored;

use App\Values\StopCondition;
use App\Values\StopConditions;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * The stop conditions of a start as the JSON column holds them.
 */
#[MapName(SnakeCaseMapper::class)]
final class StoredStopConditions extends Data
{
    /**
     * @param  list<StoredStopCondition>  $conditions
     */
    public function __construct(
        public readonly int $attemptSeconds,
        #[DataCollectionOf(StoredStopCondition::class)]
        public readonly array $conditions,
    ) {}

    public static function fromStopConditions(StopConditions $conditions): self
    {
        return self::from([
            'attempt_seconds' => $conditions->attemptSeconds,
            'conditions' => $conditions->conditions,
        ]);
    }

    public function toStopConditions(): StopConditions
    {
        return StopConditions::make(
            array_map(
                fn (StoredStopCondition $condition): StopCondition => $condition->toStopCondition(),
                $this->conditions,
            ),
            $this->attemptSeconds,
        );
    }
}
