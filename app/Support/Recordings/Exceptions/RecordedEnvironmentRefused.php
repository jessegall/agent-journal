<?php

declare(strict_types=1);

namespace App\Support\Recordings\Exceptions;

use RuntimeException;

/**
 * A recorded exchange carries variables of the recording user's own terminal or Claude Code session, which a
 * recording must never hold.
 */
final class RecordedEnvironmentRefused extends RuntimeException
{
    /**
     * @param  list<string>  $variables
     */
    public static function naming(array $variables): self
    {
        $named = implode(', ', $variables);

        return new self("The recorded exchange carries the variables {$named} of the recording user's own session.");
    }
}
