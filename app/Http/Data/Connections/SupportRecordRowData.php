<?php

declare(strict_types=1);

namespace App\Http\Data\Connections;

use App\Connections\Models\ConnectionAudit;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One step of a connected folder's support record as the owner reads it: what was done, by which kind of actor and
 * its id, on which project, and when. It names identifiers only, never a ticket, code, bearer or secret.
 */
#[TypeScript]
final class SupportRecordRowData extends Data
{
    public function __construct(
        public readonly string $action,
        public readonly string $actor,
        public readonly string|null $projectId,
        public readonly string $at,
    ) {}

    public static function fromAudit(ConnectionAudit $audit): self
    {
        return self::from([
            'action' => $audit->type->label(),
            'actor' => "{$audit->actor_type->value} {$audit->actor_id}",
            'projectId' => $audit->project_id,
            'at' => $audit->created_at->toIso8601String(),
        ]);
    }
}
