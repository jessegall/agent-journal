<?php

declare(strict_types=1);

namespace App\Profiles\Data;

use App\Agents\Enums\AccessType;
use App\Values\StopCondition;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * One stop condition of a proposed profile as the proposal writes it; a label left out is the key.
 */
#[MapName(SnakeCaseMapper::class)]
final class ProposedStopConditionData extends Data
{
    /**
     * @param  list<string>  $arguments
     * @param  list<string>  $access  the access type names
     */
    public function __construct(
        public readonly string $key,
        public readonly string $executable,
        public readonly string|null $label = null,
        public readonly array $arguments = [],
        public readonly array $access = [
            'read',
            'execute',
        ],
        public readonly string $directory = 'workspace',
        public readonly int $timeoutSeconds = StopCondition::DEFAULT_SECONDS,
        public readonly int $outputBytes = StopCondition::OUTPUT_BYTES,
        public readonly string $guidance = '',
    ) {}

    public function toStopCondition(): StopCondition
    {
        return StopCondition::from([
            'key' => $this->key,
            'label' => $this->label ?? $this->key,
            'executable' => $this->executable,
            'arguments' => $this->arguments,
            'access_types' => array_map(AccessType::from(...), $this->access),
            'directory' => $this->directory,
            'timeout_seconds' => $this->timeoutSeconds,
            'output_bytes' => $this->outputBytes,
            'guidance' => $this->guidance,
        ]);
    }
}
