<?php

declare(strict_types=1);

namespace App\Domain\Agents;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * The bypasses a host uploads in one call after the journal came back.
 */
final class BypassReport extends Data
{
    /**
     * @param  list<BypassFact>  $bypasses
     */
    public function __construct(
        #[DataCollectionOf(BypassFact::class)]
        public readonly array $bypasses,
    ) {}

    public function isEmpty(): bool
    {
        return $this->bypasses === [];
    }
}
