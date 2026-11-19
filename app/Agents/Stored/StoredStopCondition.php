<?php

declare(strict_types=1);

namespace App\Agents\Stored;

use App\Agents\Values\StopCondition;
use App\Operations\Enums\AccessType;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * One stop condition as the JSON column holds it.
 */
#[MapName(SnakeCaseMapper::class)]
final class StoredStopCondition extends Data
{
    /**
     * @param  list<string>  $arguments
     * @param  list<string>  $access  the access type names
     */
    public function __construct(
        public readonly string $key,
        public readonly string $label,
        public readonly string $executable,
        public readonly array $arguments,
        public readonly array $access,
        public readonly string $directory,
        public readonly int $timeoutSeconds,
        public readonly int $outputBytes,
        public readonly string $guidance,
    ) {}

    public static function fromStopCondition(StopCondition $condition): self
    {
        return self::from([
            'key' => $condition->key,
            'label' => $condition->label,
            'executable' => $condition->executable,
            'arguments' => $condition->arguments,
            'access' => array_map(fn (AccessType $access): string => $access->value, $condition->accessTypes),
            'directory' => $condition->directory,
            'timeout_seconds' => $condition->timeoutSeconds,
            'output_bytes' => $condition->outputBytes,
            'guidance' => $condition->guidance,
        ]);
    }

    public function toStopCondition(): StopCondition
    {
        return new StopCondition(
            $this->key,
            $this->label,
            $this->executable,
            $this->arguments,
            array_map(AccessType::from(...), $this->access),
            $this->directory,
            $this->timeoutSeconds,
            $this->outputBytes,
            $this->guidance,
        );
    }
}
