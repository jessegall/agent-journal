<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use RuntimeException;

/**
 * A host read of start secrets this request did not produce.
 */
final class StartSecretsMissing extends RuntimeException
{
    public static function forRequest(string $requestId): self
    {
        return new self("No start secrets are held for request {$requestId}.");
    }
}
