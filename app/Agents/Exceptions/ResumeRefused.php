<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Agents\Enums\ResumeRefusal;
use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A start that chose a conversation it may not continue, refused before anything starts.
 */
final class ResumeRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    private function __construct(public readonly ResumeRefusal $refusal)
    {
        parent::__construct($refusal->label());
    }

    public static function because(ResumeRefusal $refusal): self
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
