<?php

declare(strict_types=1);

namespace App\Ui\Exceptions;

use LogicException;

/**
 * A second draft producer was registered for a noun that has one.
 */
final class DraftProducerRepeated extends LogicException
{
    public static function forNoun(string $noun): self
    {
        return new self("A draft producer is already registered for {$noun}.");
    }
}
