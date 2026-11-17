<?php

declare(strict_types=1);

namespace App\Core\Links\Exceptions;

use RuntimeException;

/**
 * A stored link names a type that is neither a registered link name nor a known former class name, so the migration
 * stops instead of guessing.
 */
final class UnknownLinkType extends RuntimeException
{
    /**
     * @param  list<string>  $types
     */
    public static function stored(array $types): self
    {
        return new self('Links store types the migration does not know: '.implode(', ', $types).'. Add each to the mapping in the alias_link_types migration, or remove those links, then migrate again.');
    }
}
