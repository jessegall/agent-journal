<?php

declare(strict_types=1);

namespace App\Http\Data\Connections;

use App\Connections\Models\DeviceGrant;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One terminal sign-in of a connected folder as the owner sees it: its grant id and nonsecret reference, the account
 * that approved it, when it was handed out and until when, and where it stands. Never its bearer.
 */
#[TypeScript]
final class TerminalSignInRowData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $reference,
        public readonly string $approvedBy,
        public readonly string|null $issuedAt,
        public readonly string|null $expiresAt,
        public readonly string $state,
    ) {}

    public static function fromGrant(DeviceGrant $grant, string $approvedBy, CarbonImmutable $serverTime): self
    {
        return self::from([
            'id' => $grant->id,
            'reference' => (string) $grant->reference,
            'approvedBy' => $approvedBy,
            'issuedAt' => $grant->grant_expires_at?->subHours(DeviceGrant::GRANT_HOURS)->toIso8601String(),
            'expiresAt' => $grant->grant_expires_at?->toIso8601String(),
            'state' => $grant->approvalStateAt($serverTime),
        ]);
    }
}
