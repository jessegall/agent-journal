<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Contracts\Refusals\StartRefusal;
use App\Enums\Engine\RefusalCode;
use App\Enums\Sessions\ResumeRefusal;
use App\Exceptions\Concerns\ThrowsLater;
use RuntimeException;

/**
 * A start that chose a conversation it may not continue, refused before anything starts.
 */
final class ResumeRefused extends RuntimeException implements CodedRefusal, StartRefusal
{
    use RendersRefusal;

    /**
     * @use ThrowsLater<ResumeRefused>
     */
    use ThrowsLater;

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
