<?php

declare(strict_types=1);

namespace App\Search\Exceptions;

use LogicException;

/**
 * The cache store that keeps searches cannot lock, so two calls of one search could overwrite each other's state.
 */
final class SearchStoreLocksMissing extends LogicException
{
    public static function for(string $store): self
    {
        return new self("Searches keep their state in the cache, and the cache store {$store} cannot lock it.");
    }
}
