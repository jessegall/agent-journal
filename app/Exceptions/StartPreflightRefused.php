<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Contracts\Refusals\StartRefusal;
use App\Enums\Engine\RefusalCode;
use App\Enums\Starts\StartPreflightRefusal;
use RuntimeException;

/**
 * A start refused by its preflight, before anything was stopped or reserved for it.
 */
final class StartPreflightRefused extends RuntimeException implements CodedRefusal, StartRefusal
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

    public function reason(): StartPreflightRefusal
    {
        return $this->refusal;
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
