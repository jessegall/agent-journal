<?php

declare(strict_types=1);

namespace App\Connections\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A terminal's request as the owner checks it: the code to compare with the terminal's, the project and its
 * environment, the machine, the journal it signs in to, the scopes it grants, when it expires, where it stands now
 * (pending, approved, issued, expired, revoked) and whether the project's connection was revoked meanwhile.
 */
#[TypeScript]
final class DeviceApprovalData extends Data
{
    /**
     * @param  list<string>  $scopes
     */
    public function __construct(
        public readonly string $userCode,
        public readonly string $projectLabel,
        public readonly string $machineLabel,
        public readonly array $scopes,
        public readonly string $expiresAt,
        public readonly string $journalOrigin,
        public readonly string $environmentLabel,
        public readonly string $state,
        public readonly bool $isBindingRevoked,
    ) {}
}
