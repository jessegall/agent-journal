<?php

declare(strict_types=1);

namespace App\Reads\Values;

use App\Reads\Support\ReadBuilder;
use Closure;
use Illuminate\Database\Eloquent\Relations\Relation;

/**
 * How many rows of a to-many relation an eager load reads: all of them up to a declared most.
 */
final readonly class RelationRead
{
    private function __construct(public int $max) {}

    public static function complete(int $max): self
    {
        return new self($max);
    }

    /**
     * The eager-load constraint that declares this read on the relation's query.
     *
     * @return Closure(Relation<*, *, *>): void
     */
    public function constraint(): Closure
    {
        return function (Relation $relation): void {
            $query = $relation->getQuery();

            if ($query instanceof ReadBuilder) {
                $query->readRelationCompletely($this->max);
            }
        };
    }
}
