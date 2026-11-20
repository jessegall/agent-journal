<?php

declare(strict_types=1);

namespace App\Agents\Values;

/**
 * What a parent's import of certified helper work brought in: the ref it sits under and its commits, oldest first.
 */
final readonly class HelperImportReceipt
{
    /**
     * @param  list<string>  $commits
     */
    public function __construct(
        public string $ref,
        public array $commits,
    ) {}
}
