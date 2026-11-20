<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A merge of reviewed work that may not run: no typed approval, a protected target, or no supervision to admit it.
 */
final class MergeRefused extends RuntimeException implements CommandRefusal
{
    public static function notApproved(string $decisionId): self
    {
        return new self("Review decision {$decisionId} is no typed approval, so nothing is merged.");
    }

    public static function protectedTarget(string $branch): self
    {
        return new self("Branch {$branch} is protected: reviewed work is never merged into it.");
    }

    public static function unavailable(): self
    {
        return new self('Merging reviewed work needs supervision, which is not available.');
    }
}
