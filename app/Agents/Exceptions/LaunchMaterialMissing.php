<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use RuntimeException;

/**
 * A host read of launch material this request did not produce.
 */
final class LaunchMaterialMissing extends RuntimeException
{
    public static function forRequest(string $requestId): self
    {
        return new self("No launch material is held for request {$requestId}.");
    }
}
