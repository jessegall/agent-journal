<?php

declare(strict_types=1);

namespace App\Support;

/**
 * One batch of linked targets for their provider to read: the sources they are linked from, the target records of
 * that provider's alias, and where to go on from a previous page, or null for the first.
 */
final readonly class ShareTargetRequest
{
    /**
     * @param  list<RecordIdentity>  $sources
     * @param  list<RecordIdentity>  $targets
     */
    public function __construct(
        public array $sources,
        public array $targets,
        public string|null $continuation,
    ) {}
}
