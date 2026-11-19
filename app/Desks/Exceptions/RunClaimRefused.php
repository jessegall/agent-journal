<?php

declare(strict_types=1);

namespace App\Desks\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A run claimed by an actor that neither holds its work nor sits at the desk that holds it, or claimed while another
 * actor's claim on it still stands.
 */
final class RunClaimRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function notTheHolder(string $runId): self
    {
        return new self("Run {$runId} belongs to work you do not hold and no desk you sit at holds.");
    }

    public static function claimedByAnother(string $runId): self
    {
        return new self("Another actor works on run {$runId}.");
    }

    protected function status(): int
    {
        return 403;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Forbidden;
    }
}
