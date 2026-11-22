<?php

declare(strict_types=1);

namespace App\Values;

/**
 * One read a caller asks for: the read's name, its real arguments and target, or no record at all for discovery.
 * The read's entitlement is declared once, by name, in ReadEntitlements.
 */
final readonly class ReadRequest
{
    /**
     * @param  array<string, string>  $arguments
     */
    public function __construct(
        public string $name,
        public array $arguments = [],
        public bool $discovery = false,
        public string|null $target = null,
    ) {}

    public static function forDiscovery(string $name): self
    {
        return new self($name, discovery: true);
    }

    public function matchesRecovery(RecoveryCall $recovery): bool
    {
        return $this->name === $recovery->tool
            && ($this->discovery || array_diff_assoc($recovery->arguments, $this->arguments) === []);
    }
}
