<?php

declare(strict_types=1);

namespace App\Skills\Values;

/**
 * What one session's next publication delivers: its driver and target, and the selection with its digest.
 */
final readonly class PublicationIntent
{
    /**
     * @param  list<string>  $skillKeys  the keys of the selected skills, in the generation's order
     */
    public function __construct(
        public string $sessionId,
        public string $driver,
        public string $target,
        public string $selectionDigest,
        public array $skillKeys,
    ) {}
}
