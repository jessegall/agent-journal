<?php

declare(strict_types=1);

namespace App\Reads\Exceptions;

use RuntimeException;

/**
 * A registered model that does not bound its reads; the application does not start with one.
 */
final class ReadPolicyMissing extends RuntimeException
{
    public static function for(string $model, string $linkType): self
    {
        return new self("{$model} (link type {$linkType}) does not bound its reads; implement App\\Reads\\Contracts\\ReadableModel and use App\\Reads\\Support\\BoundedReads.");
    }
}
