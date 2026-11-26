<?php

declare(strict_types=1);

namespace App\Sharing\Data;

use App\Sharing\Enums\ShareStatus;
use App\Sharing\Support\ShareProposalStatus;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * An agent's share proposal as its agent reads it: number and state, never an address.
 */
#[TypeScript]
final class ShareProposalStatusData extends Data
{
    public function __construct(
        public readonly int $number,
        public readonly ShareStatus $status,
    ) {}

    public static function fromStatus(ShareProposalStatus $status): self
    {
        return new self($status->number, $status->status);
    }
}
