<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\RefusalCode;
use RuntimeException;

/**
 * A child claim the journal does not issue: its parent's root has no commit, the read names no binding's commit, or
 * the parent's HEAD moved since the read, so a fresh read and claim are needed.
 */
final class ChildClaimRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function firstCommitMissing(): self
    {
        return new self('The project has no commit yet: make a first commit, then dispatch the child again.');
    }

    public static function readWithoutCommit(): self
    {
        return new self('This workspace read names no commit, so no child can start from it; read the workspace again.');
    }

    public static function baseMoved(string $base, string $head): self
    {
        return new self("The parent's HEAD moved from {$base} to {$head}; read the workspace again and claim afresh.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::StateBlocked;
    }

    protected function status(): int
    {
        return 409;
    }
}
