<?php

declare(strict_types=1);

namespace App\Http\Data\Sharing;

use App\Sharing\Enums\ShareState;
use App\Sharing\Models\Share;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One share as its owner manages it: state, root, gateway, deadline and approved members, and which of reveal, retry
 * and revoke apply now, with a page of its audit and its gateway's runtime state. Its address is never part of it; the
 * reveal action answers with it alone.
 */
#[TypeScript]
final class ShareDetailData extends Data
{
    /**
     * @param  list<ShareMemberData>  $members
     */
    public function __construct(
        public readonly string $id,
        public readonly int $number,
        public readonly ShareState $state,
        public readonly string $rootType,
        public readonly string $rootId,
        public readonly string|null $gatewayKey,
        public readonly int $scopeVersion,
        public readonly string $expiresAt,
        #[DataCollectionOf(ShareMemberData::class)]
        public readonly array $members,
        public readonly bool $mayReveal,
        public readonly bool $mayRetry,
        public readonly bool $mayRevoke,
        public readonly ShareAuditData $audit,
        public readonly ShareRuntimeData $runtime,
    ) {}

    /**
     * @param  list<ShareMemberData>  $members
     */
    public static function fromShare(
        Share $share,
        string|null $gatewayKey,
        array $members,
        bool $mayReveal,
        ShareAuditData $audit,
        ShareRuntimeData $runtime,
    ): self {
        return new self(
            $share->id,
            $share->number,
            $share->state,
            $share->root_type,
            $share->root_id,
            $gatewayKey,
            $share->scope_version,
            $share->expires_at->toIso8601String(),
            $members,
            $mayReveal,
            $share->state->mayRetry() && $share->expires_at->isFuture(),
            ! $share->state->isTerminal(),
            $audit,
            $runtime,
        );
    }
}
