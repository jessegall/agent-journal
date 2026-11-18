<?php

declare(strict_types=1);

namespace Domain\Documents\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * An edit of a draft that is not open for this editor.
 */
final class DraftMissing extends RuntimeException implements CommandRefusal
{
    public static function forDocument(int $number): self
    {
        return new self("No draft of doc {$number} is open for you; open it first with doc:open {$number}.");
    }
}
