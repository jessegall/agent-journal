<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Agents\Enums\StartPreflightRefusal;
use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A start refused by its preflight, before anything was stopped or reserved for it.
 */
final class StartPreflightRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    private function __construct(public readonly StartPreflightRefusal $refusal)
    {
        parent::__construct($refusal->label());
    }

    public static function because(StartPreflightRefusal $refusal): self
    {
        return new self($refusal);
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Conflict;
    }

    protected function status(): int
    {
        return 409;
    }
}
