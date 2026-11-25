<?php

declare(strict_types=1);

namespace Domain\Sharing\Data;

use Domain\Sharing\Enums\ShareStatus;
use Domain\Sharing\Models\Share;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One share or proposal in the owner's list: its number, state, root, gateway and deadline, never its address.
 */
#[TypeScript]
final class ShareRowData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly int $number,
        public readonly ShareStatus $state,
        public readonly string $rootType,
        public readonly string $rootId,
        public readonly string|null $gatewayKey,
        public readonly string $expiresAt,
        public readonly bool $isProposal,
    ) {}

    /**
     * @param  array<string, string>  $gatewayKeys  the gateway key of each configuration, by id
     */
    public static function fromShare(Share $share, array $gatewayKeys): self
    {
        return new self(
            $share->id,
            $share->number,
            $share->status,
            $share->root_type,
            $share->root_id,
            $gatewayKeys[$share->share_gateway_configuration_id ?? ''] ?? null,
            $share->expires_at->toIso8601String(),
            $share->status === ShareStatus::Proposed,
        );
    }
}
