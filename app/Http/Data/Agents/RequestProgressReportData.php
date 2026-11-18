<?php

declare(strict_types=1);

namespace App\Http\Data\Agents;

use App\Agents\Enums\RequestOutcome;
use App\Agents\Enums\RequestProgress;
use App\Agents\Values\ScriptProgress;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\LaravelData\Optional;

/**
 * A host's report of how one attempt of a request went.
 */
#[MapInputName(SnakeCaseMapper::class)]
final class RequestProgressReportData extends Data
{
    public function __construct(
        public readonly string $requestId,
        public readonly int $attempt,
        public readonly RequestProgress $progress,
        public readonly string|null $actualBinding,
        public readonly RequestOutcome|null $outcome,
        public readonly ScriptProgressData|Optional $script = new Optional(),
    ) {}

    /**
     * The key script progress the host reported with the attempt, if it runs one.
     */
    public function scriptProgress(): ScriptProgress|null
    {
        return $this->script instanceof ScriptProgressData ? $this->script->progress() : null;
    }
}
