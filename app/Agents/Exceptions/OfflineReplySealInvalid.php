<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use RuntimeException;

/**
 * A relay's offline settings carry no seal the journal issued for this start: edited, copied or missing.
 */
final class OfflineReplySealInvalid extends RuntimeException
{
    public static function forStart(): self
    {
        return new self('The offline settings of this start were not issued for it by the journal; start again.');
    }
}
