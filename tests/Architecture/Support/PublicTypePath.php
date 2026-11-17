<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

/**
 * A class name shown in a public signature, with the member that shows it, such as PlanCard::$tasks.
 */
final readonly class PublicTypePath
{
    public function __construct(
        public string $file,
        public int $line,
        public string $name,
        public string $member,
    ) {}
}
