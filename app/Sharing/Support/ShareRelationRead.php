<?php

declare(strict_types=1);

namespace App\Sharing\Support;

use App\Records\Support\RecordIdentity;

/**
 * One page of an owned relation for the parent's provider to read: the parent, the relation's name, how many at most
 * and where to go on from a previous page, or null for the first.
 */
final readonly class ShareRelationRead
{
    public function __construct(
        public RecordIdentity $parent,
        public string $relation,
        public int $limit,
        public string|null $continuation,
    ) {}
}
