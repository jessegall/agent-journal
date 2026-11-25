<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Contracts\Refusals\RefusalRecovery;
use App\Enums\Engine\RefusalCode;
use App\Values\RecoveryCall;
use RuntimeException;

final class CommandAdmissionRefused extends RuntimeException implements CodedRefusal, CommandRefusal, RefusalRecovery
{
    private function __construct(
        private readonly RefusalCode $refusal,
        string $reason,
        public readonly RecoveryCall|null $recovery,
    ) {
        parent::__construct($reason);
    }

    public static function forDecision(RefusalCode $code, string $reason, RecoveryCall|null $recovery): self
    {
        return new self($code, $reason, $recovery);
    }

    public function refusalCode(): RefusalCode
    {
        return $this->refusal;
    }

    public function recovery(): RecoveryCall|null
    {
        return $this->recovery;
    }
}
