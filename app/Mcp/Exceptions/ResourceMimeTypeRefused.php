<?php

declare(strict_types=1);

namespace App\Mcp\Exceptions;

use LogicException;

/**
 * A journal resource declared with a MIME type the journal does not serve.
 */
final class ResourceMimeTypeRefused extends LogicException
{
    public static function for(string $resource, string $mimeType): self
    {
        return new self("The resource {$resource} declares {$mimeType}; a journal resource is application/json or text/markdown.");
    }
}
