<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Contracts\Refusals\StaleRefusal;
use App\Enums\RefusalCode;
use RuntimeException;

/**
 * An agent wrote in a chat without a live claim on its turn to speak, or with a turn kept for something else.
 */
final class SpeechRefused extends RuntimeException implements CodedRefusal, StaleRefusal
{
    use RendersRefusal;

    private function __construct(string $message, private readonly string $staleCode)
    {
        parent::__construct($message);
    }

    public static function unclaimed(): self
    {
        return new self('Claim your turn to speak in this chat before you write in it.', 'speech-unclaimed');
    }

    public static function staleClaim(): self
    {
        return new self('This claim on your turn to speak has ended; claim it again.', 'speech-claim-stale');
    }

    public static function noTurn(string $rootId): self
    {
        return new self("You have no turn to speak on message {$rootId}.", 'speech-no-turn');
    }

    public static function reservedFor(string $questionId): self
    {
        return new self("Your turn is kept for question {$questionId}: answer or decline it.", 'speech-reserved');
    }

    public static function notThisTurn(): self
    {
        return new self(
            'Claim your turn with the batch id and claim grant of the turn that showed you the message.',
            'speech-not-this-turn',
        );
    }

    public static function targetBusy(string $agentId): self
    {
        return new self(
            "Agent {$agentId} has no open turn to answer here: it is claimed, kept for a question or used.",
            'speech-target-busy',
        );
    }

    protected function status(): int
    {
        return 409;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Conflict;
    }

    public function staleCode(): string
    {
        return $this->staleCode;
    }
}
