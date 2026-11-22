<?php

declare(strict_types=1);

namespace App\Values;

/**
 * One item of a host's protection report: whether the pinned client keeps its tools from it there, the native run
 * that showed it, or why it is not kept.
 *
 * @phpstan-type StoredItem array{item: string, enforced: bool, evidence: string, reason: string}
 */
final readonly class ProtectedItem
{
    public function __construct(
        public string $item,
        public bool $enforced,
        public string $evidence,
        public string $reason,
    ) {}

    /**
     * @param  StoredItem  $stored
     */
    public static function fromStored(array $stored): self
    {
        return new self($stored['item'], $stored['enforced'], $stored['evidence'], $stored['reason']);
    }

    /**
     * @return StoredItem
     */
    public function stored(): array
    {
        return [
            'item' => $this->item,
            'enforced' => $this->enforced,
            'evidence' => $this->evidence,
            'reason' => $this->reason,
        ];
    }
}
