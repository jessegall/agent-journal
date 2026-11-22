<?php

declare(strict_types=1);

namespace Domain\Plans\Data;

use App\Assignments\Support\AssigneeName;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * An eligible worker a dispatcher may choose: its type, id and name.
 */
#[TypeScript]
final class PlanWorkRecipientData extends Data
{
    public function __construct(
        public readonly string $type,
        public readonly string $id,
        public readonly string $name,
    ) {}

    public static function ofName(AssigneeName $name): self
    {
        return new self($name->assignee->type, $name->assignee->id, $name->name);
    }
}
