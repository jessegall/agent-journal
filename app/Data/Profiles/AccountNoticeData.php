<?php

declare(strict_types=1);

namespace App\Data\Profiles;

use App\Enums\AccountNoticeReason;
use App\Models\Accounts\AccountNotice;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One open notice about a driver's accounts: the driver, the safe reason, how often and since when.
 *
 * @method static static from(AccountNotice $notice)
 * @method static static from(array<string, mixed> $payload)
 */
#[TypeScript]
final class AccountNoticeData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $driver,
        public readonly AccountNoticeReason $reason,
        public readonly int $times,
        public readonly string $since,
    ) {}

    public static function fromNotice(AccountNotice $notice): self
    {
        return new self(
            $notice->id,
            $notice->driver,
            $notice->reason,
            $notice->times,
            $notice->created_at->toIso8601String(),
        );
    }
}
