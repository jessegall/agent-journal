<?php

declare(strict_types=1);

namespace App\Values;

use App\Agents\Drivers\Enums\DriverOperation;
use App\Agents\Drivers\Enums\RequestOutcome;
use App\Agents\Drivers\Enums\RequestProgress;
use App\Models\Drivers\DriverRequest;

/**
 * What a host saw when a turn ended, as it saw it, and the journal's one judgement of it: a result that says the turn
 * failed, a Codex status other than completed or interrupted, or a process that exited with an error fails the turn;
 * an end the host could not read leaves it uncertain; anything else applied it.
 */
final readonly class TurnEnd
{
    private const string SUCCESS_SUBTYPE = 'success';

    private const array APPLIED_CODEX_STATUSES = [
        'completed',
        'interrupted',
    ];

    public function __construct(
        public int|null $exitCode = null,
        public bool $isResultRead = false,
        public string|null $resultSubtype = null,
        public bool $isResultError = false,
        public string|null $model = null,
        public string|null $codexStatus = null,
        public bool|null $composerLeft = null,
        public string|null $problem = null,
    ) {}

    /**
     * An interrupt is done once the turn it stopped ended. A setting change staged for the turn counts as applied only
     * when the turn shows it: a model change when the turn's output names that model; an effort change, which no output
     * shows, stays unconfirmed. Any other request goes as the turn went.
     */
    public function progressOf(DriverRequest $request): RequestProgress
    {
        if ($request->operation === DriverOperation::Interrupt) {
            return RequestProgress::Applied;
        }

        if (! $request->changesASetting()) {
            return $this->progress();
        }

        if ($request->operation === DriverOperation::ChangeModel && $this->showsModel((string) $request->model)) {
            return RequestProgress::Applied;
        }

        return RequestProgress::DeliveryUncertain;
    }

    public function progress(): RequestProgress
    {
        if ($this->failed()) {
            return RequestProgress::Failed;
        }

        if ($this->isUnread()) {
            return RequestProgress::DeliveryUncertain;
        }

        return RequestProgress::Applied;
    }

    /**
     * Why the request went as it did: an interrupt or a setting change carries no outcome of the turn, any other
     * request the turn's own.
     */
    public function outcomeOf(DriverRequest $request): RequestOutcome|null
    {
        if ($this->isSettledByEvidence($request)) {
            return null;
        }

        return $this->outcome();
    }

    /**
     * Why the turn failed; none for a turn that did not.
     */
    public function outcome(): RequestOutcome|null
    {
        if ($this->failed()) {
            return RequestOutcome::TurnFailed;
        }

        return null;
    }

    /**
     * Whether the request is settled by what the turn shows rather than by how the turn went: an interrupt, done once
     * the turn ended, and a setting change, applied only on its evidence.
     */
    private function isSettledByEvidence(DriverRequest $request): bool
    {
        return $request->operation === DriverOperation::Interrupt || $request->changesASetting();
    }

    /**
     * Whether the turn ran on the model asked for: the name the output gives, or one that holds the alias asked for,
     * such as claude-opus-4-5 for opus.
     */
    private function showsModel(string $requested): bool
    {
        return $this->model !== null && $requested !== '' && str_contains($this->model, $requested);
    }

    private function failed(): bool
    {
        return match (true) {
            $this->isResultRead => $this->isResultError || $this->resultSubtype !== self::SUCCESS_SUBTYPE,
            $this->codexStatus !== null => ! in_array($this->codexStatus, self::APPLIED_CODEX_STATUSES, true),
            $this->exitCode !== null => $this->exitCode !== 0,
            default => false,
        };
    }

    /**
     * Whether the host saw nothing that tells how the turn ended: no result, status, exit or composer.
     */
    private function isUnread(): bool
    {
        return ! $this->isResultRead && $this->codexStatus === null && $this->exitCode === null
            && $this->composerLeft === null;
    }
}
