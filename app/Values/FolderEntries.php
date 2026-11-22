<?php

declare(strict_types=1);

namespace App\Values;

use ArrayIterator;
use Countable;
use IteratorAggregate;
use Traversable;

/**
 * The entries a list or pattern found, sorted by path.
 *
 * @implements IteratorAggregate<int, FolderEntry>
 */
final readonly class FolderEntries implements Countable, IteratorAggregate
{
    /**
     * @param  list<FolderEntry>  $entries
     */
    private function __construct(public array $entries) {}

    /**
     * @param  list<FolderEntry>  $entries
     */
    public static function sorted(array $entries): self
    {
        usort(
            $entries,
            fn (FolderEntry $one, FolderEntry $other) => strcmp($one->path->relative, $other->path->relative),
        );

        return new self($entries);
    }

    public function isEmpty(): bool
    {
        return $this->entries === [];
    }

    public function count(): int
    {
        return count($this->entries);
    }

    /**
     * @return Traversable<int, FolderEntry>
     */
    public function getIterator(): Traversable
    {
        return new ArrayIterator($this->entries);
    }

    /**
     * @return list<FilePath>
     */
    public function paths(): array
    {
        return array_map(fn (FolderEntry $entry) => $entry->path, $this->entries);
    }
}
