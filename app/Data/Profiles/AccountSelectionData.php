<?php

declare(strict_types=1);

namespace App\Data\Profiles;

use App\Models\ActiveAccount;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Which account new starts of one driver use, with the change number that tells a newer choice from an older one.
 */
#[TypeScript]
final class AccountSelectionData extends Data
{
    public function __construct(
        public readonly string $driver,
        public readonly string|null $accountId,
        public readonly int $changeNumber,
    ) {}

    public static function fromSelection(ActiveAccount $selection): self
    {
        return new self($selection->account_protocol, $selection->account_id, $selection->change_number);
    }
}
