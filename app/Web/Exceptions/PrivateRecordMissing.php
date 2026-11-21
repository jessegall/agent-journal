<?php

declare(strict_types=1);

namespace App\Web\Exceptions;

use RuntimeException;

/**
 * A reader's record that does not exist or that the signed-in user may not see; both answer alike, as a denied
 * result with no title or detail, so nobody learns which of the two it was.
 */
final class PrivateRecordMissing extends RuntimeException
{
    public static function forReader(): self
    {
        return new self('This item is unavailable.');
    }
}
