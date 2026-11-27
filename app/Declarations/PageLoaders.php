<?php

declare(strict_types=1);

namespace App\Declarations;

use App\Navigation\Declarations\Loader;

/**
 * The reads a page offers beside its own result, added in its scope one after another.
 */
final class PageLoaders
{
    /**
     * @var list<Loader>
     */
    private array $loaders = [];

    /**
     * The read under the name, answered by the reader class.
     */
    public function add(string $name, string $reader): self
    {
        $this->loaders[] = Loader::make($name, $reader);

        return $this;
    }

    /**
     * @return list<Loader>
     */
    public function loaders(): array
    {
        return $this->loaders;
    }
}
