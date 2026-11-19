<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use RuntimeException;

/**
 * A host read of start material this request did not produce.
 */
final class StartMaterialMissing extends RuntimeException
{
    public static function forRequest(string $requestId): self
    {
        return new self("No start material is held for request {$requestId}.");
    }
}
