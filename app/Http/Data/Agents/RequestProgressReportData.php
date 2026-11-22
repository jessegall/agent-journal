<?php

declare(strict_types=1);

namespace App\Http\Data\Agents;

use App\Agents\Enums\HostWakeRefusal;
use App\Agents\Enums\RequestOutcome;
use App\Agents\Enums\RequestProgress;
use App\Agents\Values\NavigationRoundReport;
use App\Agents\Values\RequestReportBinding;
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
        public readonly string|null $refusalReason = null,
        public readonly bool $noProcessCreated = false,
        public readonly string|null $sessionId = null,
        public readonly string|null $processStartId = null,
        public readonly int|null $processGeneration = null,
        public readonly int|null $sequence = null,
    ) {}

    /**
     * The allowlisted reason the host refused the request for; one outside the set is kept as unknown.
     */
    public function refusal(): HostWakeRefusal|null
    {
        return $this->refusalReason === null ? null : HostWakeRefusal::fromReport($this->refusalReason);
    }

    /**
     * The claim's session, start and generation the report answers, when the host sent them.
     */
    public function binding(): RequestReportBinding|null
    {
        if ($this->sessionId === null || $this->processGeneration === null) {
            return null;
        }

        return new RequestReportBinding($this->sessionId, $this->processStartId, $this->processGeneration);
    }

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
