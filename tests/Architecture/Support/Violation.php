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
        public string $used,
        public string $usingDomain,
        public string $owner,
        public ViolationKind $kind,
        public string $detail = '',
    ) {}

    public function reason(): string
    {
        return $this->kind->reason($this);
    }
}
