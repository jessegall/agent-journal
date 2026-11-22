<?php

declare(strict_types=1);

namespace App\Communication\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\StaleRefusal;
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
