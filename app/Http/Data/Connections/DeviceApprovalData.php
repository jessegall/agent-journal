<?php

declare(strict_types=1);

namespace App\Http\Data\Connections;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A device code waiting for the owner: the code to compare with the shell's, the folder and machine it is for, the
 * scopes it grants and when it expires.
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
    ) {}
}
