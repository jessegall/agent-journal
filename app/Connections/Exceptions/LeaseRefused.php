<?php

declare(strict_types=1);

namespace App\Connections\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A lease renewal refused: another host, a revoked binding or an old authority generation, or a runtime that is not
 * the binding's in its generation and root. The relay stops the runtime when its lease ends.
 */
final class LeaseRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function for(string $runtimeId, string $reason): self
    {
        return new self("The lease of runtime {$runtimeId} is not renewed: {$reason}.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Forbidden;
    }

    protected function status(): int
    {
        return 403;
    }
}
