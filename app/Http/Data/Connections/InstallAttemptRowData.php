<?php

declare(strict_types=1);

namespace App\Http\Data\Connections;

use App\Connections\Values\InstallAttemptRow;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One row of the owner's install attempts: reference, target, state, version, creation time and a spent one's
 * binding. Never a ticket.
 */
#[TypeScript]
final class InstallAttemptRowData extends Data
{
    public function __construct(
        public readonly string $reference,
        public readonly string $target,
        public readonly string $state,
        public readonly int $version,
        public readonly string $createdAt,
        public readonly string|null $bindingId,
    ) {}

    public static function fromRow(InstallAttemptRow $row): self
    {
        return self::from([
            'reference' => $row->reference,
            'target' => $row->target,
            'state' => $row->state,
            'version' => $row->version,
            'createdAt' => $row->createdAt,
            'bindingId' => $row->bindingId,
        ]);
    }
}
