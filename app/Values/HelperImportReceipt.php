<?php

declare(strict_types=1);

namespace App\Values;

/**
 * What a parent's import of certified helper work brought in: the ref it sits under, the parent's head it was
 * compared with, the work's own head, and its commits the parent lacks, oldest first.
 */
final readonly class HelperImportReceipt
{
    /**
     * @param  list<string>  $commits
     */
    public function __construct(
        public string $ref,
        public string $base,
        public string $head,
        public array $commits,
    ) {}
}
