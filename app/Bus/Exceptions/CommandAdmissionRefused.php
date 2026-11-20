<?php

declare(strict_types=1);

namespace App\Bus\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Contracts\RefusalDetails;
use App\Bus\Enums\RefusalCode;
use App\Bus\Values\RecoveryCall;
use App\Contracts\CommandRefusal;
use RuntimeException;

final class CommandAdmissionRefused extends RuntimeException implements CodedRefusal, CommandRefusal, RefusalDetails
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

    public function refusalDetails(): array
    {
        return $this->recovery === null ? [] : ['next_action' => $this->recovery->toArray()];
    }
}
