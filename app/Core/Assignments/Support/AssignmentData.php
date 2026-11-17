<?php

declare(strict_types=1);

namespace App\Core\Assignments\Support;

use App\Core\Actors\Enums\ActorKind;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Who holds a record, as the browser shows it: a user or an agent by id and name, and the assignment reference a
 * deliberate change must name. Ids travel as decimal strings so a bigint keeps its precision.
 */
#[TypeScript]
final class AssignmentData extends Data
{
    public function __construct(
        public readonly ActorKind $kind,
        public readonly string $id,
        public readonly string $name,
        public readonly string $reference,
    ) {}

    public static function ofHolder(AssignmentHolder $holder): self
    {
        return self::from([
            'kind' => $holder->actor()->kind,
            'id' => (string) $holder->actor()->id,
            'name' => $holder->name,
            'reference' => (string) $holder->reference()->id,
        ]);
    }

    /**
     * The holder as one line of text: its kind, id and name.
     */
    public function label(): string
    {
        return "{$this->kind->value} {$this->id} {$this->name}";
    }
}
