<?php

declare(strict_types=1);

namespace App\Values;

/**
 * The exact command line a permit lets run once: where, the digest of how it was classified, and the classes approved.
 */
final readonly class PermittedLine
{
    /**
     * @param  list<string>  $approvedClasses
     */
    public function __construct(
        public string $line,
        public string $workingFolder,
        public string $classificationDigest,
        public array $approvedClasses,
    ) {}
}
