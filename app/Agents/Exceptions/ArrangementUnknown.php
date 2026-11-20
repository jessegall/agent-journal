<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use RuntimeException;

/**
 * AGENTS_ARRANGEMENT names neither arrangement, so the journal cannot tell where its agents run.
 */
final class ArrangementUnknown extends RuntimeException
{
    public static function for(string $value): self
    {
        return new self("AGENTS_ARRANGEMENT is \"{$value}\": set it to local or contained.");
    }
}
