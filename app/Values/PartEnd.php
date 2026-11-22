<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\PartEndType;

/**
 * How a part's process ended. Only an exit has a status code and only a signal has a signal number, so a signalled
 * part never reads as status 0.
 */
final readonly class PartEnd
{
    private function __construct(public PartEndType $type, public int $code, public string $reason) {}

    public static function notYet(): self
    {
        return new self(PartEndType::NotYet, 0, '');
    }

    public static function exited(int $status): self
    {
        return new self(PartEndType::Exited, $status, '');
    }

    public static function signalled(int $signal): self
    {
        return new self(PartEndType::Signalled, $signal, '');
    }

    public static function unavailable(string $reason): self
    {
        return new self(PartEndType::Unavailable, 0, $reason);
    }

    public function hasEnded(): bool
    {
        return $this->type !== PartEndType::NotYet;
    }

    /**
     * The exit status, which only an exited part has.
     */
    public function hasStatus(): bool
    {
        return $this->type === PartEndType::Exited;
    }
}
