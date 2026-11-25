<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\Engine\RefusalCode;
use App\Exceptions\Concerns\ThrowsLater;
use RuntimeException;

/**
 * An outcome or a health report that does not match what the run holds: another endpoint version, another or an
 * expired lease, or an operation it never claimed.
 */
final class GatewayLeaseRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    /** @use ThrowsLater<GatewayLeaseRefused> */
    use ThrowsLater;

    public static function forOperation(string $operationId): self
    {
        return new self(
            sprintf(
                'Gateway operation %s is not held under this run, endpoint version and lease; its outcome is ignored.',
                $operationId,
            ),
        );
    }

    public static function forEndpoint(string $configurationId, int $version): self
    {
        return new self(
            "Endpoint version {$version} of configuration {$configurationId} is not held by this run.",
        );
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
