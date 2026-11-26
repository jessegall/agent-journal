<?php

declare(strict_types=1);

namespace App\Search\Exceptions;

use LogicException;

/**
 * A domain declared a searchable whose key, label or classes the search cannot use.
 */
final class SearchableInvalid extends LogicException
{
    public static function forKey(string $key): self
    {
        return new self('A searchable key is lower case, starts with a letter and holds at most 48 bytes of letters, '
            ."digits, _ and -; \"{$key}\" is not one.");
    }

    public static function forLabel(string $key): self
    {
        return new self("The searchable {$key} has a blank label.");
    }

    public static function forQualifiedLabel(string $key, string $label): self
    {
        return new self("The searchable {$key} has the label \"{$label}\", which reads as a qualified key.");
    }

    public static function forQualifiedLength(string $qualifiedKey, int $limit): self
    {
        return new self("The searchable key {$qualifiedKey} is longer than {$limit} bytes.");
    }

    public static function forDuplicate(string $qualifiedKey, string $firstOwner, string $secondOwner): self
    {
        return new self("The searchable key {$qualifiedKey} is declared by both {$firstOwner} and {$secondOwner}.");
    }
}
