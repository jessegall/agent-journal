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
        public bool $isDiscovery = false,
        public string|null $target = null,
    ) {}

    /**
     * The read of one record by its id argument, targeted at that record so a grant scoped to it admits it.
     */
    public static function forRecord(string $name, string $argument, string $recordId): self
    {
        return new self($name, arguments: [$argument => $recordId], target: $recordId);
    }

    public static function forDiscovery(string $name): self
    {
        return new self($name, isDiscovery: true);
    }

    public function matchesRecovery(RecoveryCall $recovery): bool
    {
        return $this->name === $recovery->tool
            && ($this->isDiscovery || array_diff_assoc($recovery->arguments, $this->arguments) === []);
    }
}
