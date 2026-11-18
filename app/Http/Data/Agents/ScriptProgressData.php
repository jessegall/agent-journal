<?php

declare(strict_types=1);

namespace App\Http\Data\Agents;

use App\Agents\Values\ScriptProgress;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * A host's report of where its key script run stands: the confirmed step, the matched screen generation and what it
 * saw.
 */
#[MapInputName(SnakeCaseMapper::class)]
final class ScriptProgressData extends Data
{
    public function __construct(
        public readonly int $step,
        public readonly int $generation,
        public readonly string $evidence,
    ) {}

    public function progress(): ScriptProgress
    {
        return new ScriptProgress($this->step, $this->generation, $this->evidence);
    }
}
