<?php

declare(strict_types=1);

namespace App\Agents\Values;

/**
 * One request handed to a host: which runtime, which request and attempt, and what to do, with the key script to run
 * and the step it stopped at when it is one, and the session, supervised start and process generation the claim
 * binds the host's report to.
 */
final readonly class ClaimedRequest
{
    /**
     * @param  list<ScriptParameter>  $scriptParameters
     */
    public function __construct(
        public string $runtimeId,
        public string $requestId,
        public int $sequence,
        public int $attempt,
        public string $operation,
        public string|null $message,
        public string|null $model,
        public string|null $effort,
        public string|null $script,
        public int|null $scriptVersion,
        public array $scriptParameters,
        public int|null $scriptStep,
        public string|null $navigationRequestId,
        public NavigationRound|null $navigationRound,
        public string $sessionId,
        public string|null $processStartId,
        public int $processGeneration,
    ) {}

    /**
     * The same claim carrying the prompt its wake presents, such as a batch of chat text to show.
     */
    public function withMessage(string $message): self
    {
        return new self(
            $this->runtimeId,
            $this->requestId,
            $this->sequence,
            $this->attempt,
            $this->operation,
            $message,
            $this->model,
            $this->effort,
            $this->script,
            $this->scriptVersion,
            $this->scriptParameters,
            $this->scriptStep,
            $this->navigationRequestId,
            $this->navigationRound,
            $this->sessionId,
            $this->processStartId,
            $this->processGeneration,
        );
    }

    /**
     * The same request carrying another message, as a private input carries its value to the host only.
     */
    public function withMessage(string $message): self
    {
        return new self(
            $this->runtimeId,
            $this->requestId,
            $this->sequence,
            $this->attempt,
            $this->operation,
            $message,
            $this->model,
            $this->effort,
            $this->script,
            $this->scriptVersion,
            $this->scriptParameters,
            $this->scriptStep,
            $this->navigationRequestId,
            $this->navigationRound,
            $this->sessionId,
            $this->processStartId,
            $this->processGeneration,
        );
    }
}
