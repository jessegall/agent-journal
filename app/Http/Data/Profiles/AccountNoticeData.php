<?php

declare(strict_types=1);

namespace App\Http\Data\Profiles;

use App\Profiles\Enums\AccountNoticeReason;
use App\Profiles\Models\AccountNotice;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One open notice about a program's accounts: the program, the safe reason, how often and since when.
 */
#[TypeScript]
final class AccountNoticeData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $program,
        public readonly AccountNoticeReason $reason,
        public readonly int $times,
        public readonly string $since,
    ) {}

    public static function fromNotice(AccountNotice $notice): self
    {
        return new self(
            $notice->id,
            $notice->program,
            $notice->reason,
            $notice->times,
            $notice->created_at?->toIso8601String() ?? '',
        );
    }
}
