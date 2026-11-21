<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

/**
 * One use of native reflection RawReflectionRule found: where it is, what it does, and the wrapper call to use.
 */
final readonly class ReflectionFinding
{
    public function __construct(
        public string $file,
        public int $line,
        public string $declaration,
        public string $operation,
        public string $message,
    ) {}

    /**
     * The finding as a failure shows it: path:line, the operation and the wrapper call to use.
     */
    public function report(): string
    {
        return "{$this->file}:{$this->line}  {$this->message}";
    }

    public function sortsBefore(self $other): int
    {
        return [$this->file, $this->line, $this->operation] <=> [$other->file, $other->line, $other->operation];
    }
}
