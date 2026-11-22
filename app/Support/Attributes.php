<?php

declare(strict_types=1);

namespace App\Support;

use Countable;
use Generator;
use IteratorAggregate;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * The attributes of one declaration that match one class, in the order PHP declares them. Counting builds nothing,
 * and iterating builds each attribute only when it is reached.
 *
 * @template A of object
 *
 * @implements IteratorAggregate<int, A>
 */
final class Attributes implements Countable, IteratorAggregate
{
    /**
     * @param  list<AttributeEntry<A>>  $entries
     */
    public function __construct(private readonly array $entries) {}

    /**
     * The first matching attribute, built; the ones after it stay unbuilt.
     *
     * @return Option<A>
     */
    public function first(): Option
    {
        if ($this->entries === []) {
            return None::create();
        }

        return new Some($this->entries[0]->instance());
    }

    public function count(): int
    {
        return count($this->entries);
    }

    /**
     * @return list<AttributeEntry<A>>
     */
    public function entries(): array
    {
        return $this->entries;
    }

    /**
     * @return Generator<int, A>
     */
    public function getIterator(): Generator
    {
        foreach ($this->entries as $entry) {
            yield $entry->instance();
        }
    }
}
