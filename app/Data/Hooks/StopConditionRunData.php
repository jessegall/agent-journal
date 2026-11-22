<?php

declare(strict_types=1);

namespace App\Data\Hooks;

use App\Values\StopCondition;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * One frozen stop condition as the host runs it: an absolute executable with argv, its folder, limits and the hash
 * its result must name.
 */
#[MapName(SnakeCaseMapper::class)]
final class StopConditionRunData extends Data
{
    /**
     * @param  list<string>  $arguments
     */
    public function __construct(
        public string $key,
        public string $definitionHash,
        public string $executable,
        public array $arguments,
        public string $directory,
        public int $timeoutSeconds,
        public int $outputBytes,
    ) {}

    public static function fromStopCondition(StopCondition $condition): self
    {
        return new self(
            $condition->key,
            $condition->definitionHash(),
            $condition->executable,
            $condition->arguments,
            $condition->directory,
            $condition->timeoutSeconds,
            $condition->outputBytes,
        );
    }
}
