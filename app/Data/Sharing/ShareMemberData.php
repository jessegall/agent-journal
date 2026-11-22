<?php

declare(strict_types=1);

namespace App\Data\Sharing;

use App\Models\ShareMember;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One linked record a share's current scope approves, with the link it was reached by.
 */
#[TypeScript]
final class ShareMemberData extends Data
{
    public function __construct(
        public readonly string $targetType,
        public readonly string $targetId,
        public readonly string $linkId,
    ) {}

    public static function fromMember(ShareMember $member): self
    {
        return new self($member->target_type, $member->target_id, $member->link_id);
    }
}
