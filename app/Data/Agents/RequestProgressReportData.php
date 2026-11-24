<?php

declare(strict_types=1);

namespace App\Data\Agents;

use App\Enums\HostWakeRefusal;
use App\Enums\RequestOutcome;
use App\Enums\RequestProgress;
use App\Exceptions\HostReportRefused;
use App\Values\NavigationRoundReport;
use App\Values\RequestReportBinding;
use App\Values\ScriptProgress;
use App\Values\TurnEnd;
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
        public readonly string|null $actualBinding,
        public readonly RequestOutcome|null $outcome = null,
        public readonly RequestProgress|null $progress = null,
        public readonly TurnEndData|Optional $turnEnd = new Optional(),
        public readonly ScriptProgressData|Optional $script = new Optional(),
        public readonly NavigationRoundReportData|Optional $navigation = new Optional(),
        public readonly string|null $refusalReason = null,
        public readonly bool $hasCreatedNoProcess = false,
        public readonly string|null $sessionId = null,
        public readonly string|null $processStartId = null,
        public readonly int|null $processGeneration = null,
        public readonly int|null $sequence = null,
    ) {}

    /**
     * How the attempt went: what the host reported, or the journal's judgement of a turn's end the host saw.
     *
     * @throws HostReportRefused when the report names neither
     */
    public function judgedProgress(): RequestProgress
    {
        if ($this->turnEnd instanceof TurnEndData) {
            return $this->turnEnd->turnEnd()->progress();
        }

        return $this->progress ?? throw HostReportRefused::withoutProgress($this->requestId);
    }

    /**
     * What the host saw when the attempt's turn ended; none for any other report.
     */
    public function turnEnd(): TurnEnd|null
    {
        if ($this->turnEnd instanceof TurnEndData) {
            return $this->turnEnd->turnEnd();
        }

        return null;
    }

    public function judgedOutcome(): RequestOutcome|null
    {
        if ($this->turnEnd instanceof TurnEndData) {
            return $this->turnEnd->turnEnd()->outcome();
        }

        return $this->outcome;
    }

    /**
     * The allowlisted reason the host refused the request for; one outside the set is kept as unknown.
     */
    public function refusal(): HostWakeRefusal|null
    {
        if ($this->refusalReason === null) {
            return null;
        }

        return HostWakeRefusal::fromReport($this->refusalReason);
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
        if ($this->navigation instanceof NavigationRoundReportData) {
            return $this->navigation->report();
        }

        return null;
    }

    /**
     * The key script progress the host reported with the attempt, if it runs one.
     */
    public function scriptProgress(): ScriptProgress|null
    {
        if ($this->script instanceof ScriptProgressData) {
            return $this->script->progress();
        }

        return null;
    }
}
