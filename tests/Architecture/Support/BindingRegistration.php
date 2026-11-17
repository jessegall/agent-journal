<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

/**
 * One binding the code states: what is bound, to which class when a class-string names it, and its lifetime.
 */
final readonly class BindingRegistration
{
    public function __construct(
        public string $file,
        public int $line,
        public string $abstract,
        public ?string $concrete,
        public bool $isScoped,
        public bool $isSingleton,
    ) {}

    public function violation(string $userOwner, string $owner, string $detail): Violation
    {
        return new Violation($this->file, $this->line, $this->abstract, $userOwner, $owner, ViolationKind::BindingMisuse, $detail);
    }
}
