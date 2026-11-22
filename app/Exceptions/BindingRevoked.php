<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\RefusalCode;
use RuntimeException;

/**
 * A call by the main agent of a revoked binding: every token it was issued is refused, also after the laptop wakes.
 */
final class BindingRevoked extends RuntimeException implements CodedRefusal
{
    use RendersRefusal;

    public static function forAgent(string $agentId): self
    {
        return new self("Agent {$agentId} works for a revoked binding. Copy a new install line to connect the folder again.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Unauthenticated;
    }

    protected function status(): int
    {
        return 401;
    }
}
