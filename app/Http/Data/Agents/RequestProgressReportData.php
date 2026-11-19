<?php

declare(strict_types=1);

namespace App\Http\Data\Agents;

use App\Agents\Enums\RequestOutcome;
use App\Agents\Enums\RequestProgress;
use App\Agents\Values\NavigationRoundReport;
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
        public readonly NavigationRoundReportData|Optional $navigation = new Optional(),
    ) {}

    /**
     * What the host saw after a navigation round, when the request is one.
     */
    public function navigationReport(): NavigationRoundReport|null
    {
        return $this->navigation instanceof NavigationRoundReportData ? $this->navigation->report() : null;
    }

    /**
     * The key script progress the host reported with the attempt, if it runs one.
     */
    public function scriptProgress(): ScriptProgress|null
    {
        return $this->script instanceof ScriptProgressData ? $this->script->progress() : null;
    }
}
