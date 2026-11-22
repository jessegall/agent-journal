<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

/**
 * A registered model that does not bound its reads; the application does not start with one.
 */
final class ReadPolicyMissing extends RuntimeException
{
    public static function for(string $model, string $linkType): self
    {
        return new self(
            sprintf(
                '%s (link type %s) does not bound its reads; implement App\\Contracts\\Records\\ReadableModel and use App\\Concerns\\BoundedReads.',
                $model,
                $linkType,
            ),
        );
    }
}
