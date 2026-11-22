<?php

declare(strict_types=1);

namespace App\Data;

use App\Support\Assignment;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Who has taken a waiting question up, by the exact claim they hold on it.
 */
#[TypeScript]
final class MessageClaimHolder extends Data
{
    public function __construct(
        public readonly string $claimId,
        public readonly string $holderType,
        public readonly string $holderId,
    ) {}

    public static function ofClaim(Assignment $claim): self
    {
        return new self($claim->reference->id, $claim->holder()->type, $claim->holder()->id);
    }
}
