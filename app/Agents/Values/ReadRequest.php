<?php

declare(strict_types=1);

namespace App\Agents\Values;

use App\Bus\Values\RecoveryCall;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;

final readonly class ReadRequest
{
    private const array RECOVERY = [
        'overview_read',
        'capabilities_read',
        'operations_read',
        'rules_list',
        'rules_read',
    ];

    /**
     * @param  array<string, string>  $arguments
     */
    public function __construct(
        public string $name,
        public ResourceAreaType $area = ResourceAreaType::JournalWork,
        public array $arguments = [],
        private bool $discovery = false,
    ) {}

    public static function forDiscovery(string $name, ResourceAreaType $area = ResourceAreaType::JournalWork): self
    {
        return new self($name, $area, discovery: true);
    }

    public function isRecovery(): bool
    {
        return in_array($this->name, self::RECOVERY, true);
    }

    public function operation(): Operation
    {
        return Operation::journal($this->name, $this->area, [AccessType::Read]);
    }

    public function matchesRecovery(RecoveryCall $recovery): bool
    {
        return $this->name === $recovery->tool
            && ($this->discovery || array_diff_assoc($recovery->arguments, $this->arguments) === []);
    }
}
