<?php

declare(strict_types=1);

namespace App\Search\Values;

/**
 * What one hit is, everywhere a search meets it: the source's qualified key, the record's type and id, and the
 * passage's location id when the hit is a passage. Ties, replays and delivered hits are all judged by it.
 */
final readonly class HitIdentity
{
    public function __construct(
        public string $sourceKey,
        public string $recordType,
        public string $recordId,
        public string|null $locationId = null,
    ) {}

    /**
     * Below zero when this identity comes first: each part ascending in binary order, an absent location first.
     */
    public function compare(self $other): int
    {
        foreach ([
            strcmp($this->sourceKey, $other->sourceKey),
            strcmp($this->recordType, $other->recordType),
            strcmp($this->recordId, $other->recordId),
        ] as $order) {
            if ($order !== 0) {
                return $order;
            }
        }

        return $this->compareLocation($other);
    }

    public function equals(self $other): bool
    {
        return $this->compare($other) === 0;
    }

    /**
     * The identity as one text, for keying maps and sets: its parts joined by a byte no part holds.
     */
    public function key(): string
    {
        return implode("\0", [$this->sourceKey, $this->recordType, $this->recordId, $this->locationId ?? '']);
    }

    private function compareLocation(self $other): int
    {
        if ($this->locationId === $other->locationId) {
            return 0;
        }

        if ($this->locationId === null) {
            return -1;
        }

        if ($other->locationId === null) {
            return 1;
        }

        return strcmp($this->locationId, $other->locationId) <=> 0;
    }
}
