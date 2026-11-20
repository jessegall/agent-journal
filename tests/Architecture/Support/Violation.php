<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

/**
 * One use of code a domain may not use.
 */
final readonly class Violation
{
    public function __construct(
        public string $file,
        public int $line,
        public string $subject,
        public string $usingDomain,
        public string $owner,
        public ViolationType $type,
        public string $detail = '',
    ) {}

    public function reason(): string
    {
        return $this->type->reason($this);
    }
}
