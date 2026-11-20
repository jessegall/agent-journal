<?php

declare(strict_types=1);

namespace App\Bus\Values;

use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\CommandAdmissionRefused;

final readonly class CommandDecision
{
    private function __construct(private CommandAdmissionRefused|null $refusal) {}

    public static function allow(): self
    {
        return new self(null);
    }

    public static function refuse(RefusalCode $code, string $reason, RecoveryCall|null $recovery = null): self
    {
        return new self(CommandAdmissionRefused::forDecision($code, $reason, $recovery));
    }

    public function requireAllowed(): void
    {
        if ($this->refusal !== null) {
            throw $this->refusal;
        }
    }
}
