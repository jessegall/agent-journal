<?php

declare(strict_types=1);

namespace App\Processes\Stored;

use App\Processes\Enums\EmptyPolicy;
use App\Processes\Values\EmptyRunPolicy;
use Spatie\LaravelData\Data;

/**
 * What a run with no output means, as a stored output contract holds it.
 */
final class StoredEmptyRunPolicy extends Data
{
    public function __construct(
        public readonly EmptyPolicy $policy,
        public readonly string $summary,
    ) {}

    public static function fromEmptyRunPolicy(EmptyRunPolicy $empty): self
    {
        return new self($empty->policy, $empty->summary);
    }

    public function toEmptyRunPolicy(): EmptyRunPolicy
    {
        return EmptyRunPolicy::stored($this->policy, $this->summary);
    }
}
