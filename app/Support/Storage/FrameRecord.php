<?php

declare(strict_types=1);

namespace App\Support\Storage;

use App\Stacks\References\StateReference;
use Carbon\CarbonImmutable;

/**
 * A frame as it is stored: its id, the reference its state is rebuilt from, whether it is the bottom, the version it
 * was
 * stored in, and the server time it entered the stack.
 */
final readonly class FrameRecord
{
    public function __construct(
        public string $id,
        public StateReference $reference,
        public bool $isBottom,
        public int $schemaVersion,
        public CarbonImmutable $enteredAt,
        /** @var array<string, mixed> the state's own values, none for a state that keeps none */
        public array $values = [],
    ) {}

    public function isSameOccurrenceAs(self $other): bool
    {
        return $this->id === $other->id
            && $this->schemaVersion === $other->schemaVersion
            && $this->enteredAt->equalTo($other->enteredAt)
            && $this->reference->isSameAs($other->reference);
    }

    /**
     * The frame named in words with the version it was stored in, for a message.
     */
    /**
     * Whether both hold the same values of their state.
     */
    public function hasSameValuesAs(self $other): bool
    {
        return $this->values === $other->values;
    }

    public function description(): string
    {
        return "The frame {$this->id} of {$this->reference->typeKey} is stored in version {$this->schemaVersion}";
    }
}
