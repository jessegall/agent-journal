<?php

declare(strict_types=1);

namespace App\Sharing\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
use RuntimeException;

/**
 * A supervisor run that no longer holds the installation's gateways: a newer run took them over, or none started.
 */
final class GatewayRunStale extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function for(string $runId): self
    {
        return new self("Supervisor run {$runId} no longer holds the gateways; stop its children and exit.");
    }

    protected function status(): int
    {
        return 409;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::StateBlocked;
    }
}
