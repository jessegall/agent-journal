<?php

declare(strict_types=1);

namespace App\Accounts\Data;

use App\Accounts\Enums\AccountProcessRole;
use App\Accounts\Enums\AccountStatus;
use App\Web\Creation\Buildable;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The account one start ran with, as the owner sees it later: its label as it is now, kept after removal, its state,
 * and when the start started and ended. No folder or other private reference is shown.
 */
#[TypeScript]
final class StartAccountData extends Data
{
    /** @use Buildable<StartAccountDataFields> */
    use Buildable;

    protected const string FIELDS = StartAccountDataFields::class;

    public function __construct(
        public readonly string $sessionId,
        public readonly string $driver,
        public readonly string $accountId,
        public readonly string $accountLabel,
        public readonly AccountStatus $accountState,
        public readonly AccountProcessRole $role,
        public readonly string $startedAt,
        public readonly string|null $endedAt,
    ) {}
}
