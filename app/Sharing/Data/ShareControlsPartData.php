<?php

declare(strict_types=1);

namespace App\Sharing\Data;

use App\Sharing\Enums\ShareStatus;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The props of a share's direct controls, a native part of its page: which share, its state, and whether its owner
 * may reveal its address, retry it and revoke it. The address itself is never part of them.
 */
#[TypeScript]
final class ShareControlsPartData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly ShareStatus $status,
        public readonly bool $mayReveal,
        public readonly bool $mayRetry,
        public readonly bool $mayRevoke,
    ) {}
}
