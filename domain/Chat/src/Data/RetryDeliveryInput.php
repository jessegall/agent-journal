<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The given-up piece of one recipient's delivery an operator asks for again.
 */
#[TypeScript]
final class RetryDeliveryInput extends Data
{
    public function __construct(
        #[Ulid]
        public readonly string $rangeId,
    ) {}
}
