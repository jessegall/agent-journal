<?php

declare(strict_types=1);

namespace App\Values;

use App\Contracts\Drivers\MessagePart;

/**
 * One request handed to a host: which runtime, which request and attempt, and what to do, with the key script to run
 * and the step it stopped at when it is one, and the session, supervised start and process generation the claim
 * binds the host's report to.
 */
final readonly class ClaimedRequest
{
    /**
     * @param  list<MessagePart>  $parts
     * @param  list<ScriptParameter>  $scriptParameters
     */
    public function __construct(
        public string $runtimeId,
        public string $requestId,
        public int $sequence,
        public int $attempt,
        public string $operation,
        public string|null $message,
        public array $parts,
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
        // Whether this is the start's bootstrap: the initial wake of a start still proving its conversation, which
        // carries no chat text and makes the driver prove its conversation without a turn.
        public bool $shouldBootstrap = false,
    ) {}

    /**
     * The same claim carrying another message: the prompt its wake presents, or a private input's value for the host.
     */
    public function withMessage(string $message): self
    {
        return clone ($this, ['message' => $message]);
    }
}
