<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\CodedRefusal;
use App\Contracts\StartRefusal;
use App\Enums\RefusalCode;
use App\Enums\ResumeRefusal;
use RuntimeException;

/**
 * A start that chose a conversation it may not continue, refused before anything starts.
 */
final class ResumeRefused extends RuntimeException implements CodedRefusal, StartRefusal
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

    public function reason(): ResumeRefusal
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
