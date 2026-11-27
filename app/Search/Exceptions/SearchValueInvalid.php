<?php

declare(strict_types=1);

namespace App\Search\Exceptions;

use LogicException;

/**
 * A provider built a search value outside its bounds: a title, snippet, location, position or page too large.
 */
final class SearchValueInvalid extends LogicException
{
    public static function tooLong(string $field, int $limit): self
    {
        return new self("A search {$field} holds at most {$limit} characters.");
    }

    public static function blank(string $field): self
    {
        return new self("A search {$field} is never blank.");
    }

    public static function forPositionField(string $name): self
    {
        return new self('A source position field is named in lower case letters and _, holds a whole number or at '
            ."most 64 bytes of text; {$name} is not one.");
    }

    public static function outOfRange(string $field, int $limit): self
    {
        return new self("A search {$field} lies between 1 and {$limit}.");
    }
}
