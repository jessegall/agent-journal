<?php

declare(strict_types=1);

namespace App\Assignments\Support;

use App\Actors\Enums\ActorType;
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
        public readonly ActorType $type,
        public readonly string $id,
        public readonly string $name,
        public readonly string $reference,
    ) {}

    public static function ofHolder(AssignmentHolder $holder): self
    {
        return self::from([
            'type' => $holder->actor()->type,
            'id' => (string) $holder->actor()->id,
            'name' => $holder->name,
            'reference' => (string) $holder->reference()->id,
        ]);
    }

    /**
     * The holder as one line of text: its type, id and name.
     */
    public function label(): string
    {
        return "{$this->type->value} {$this->id} {$this->name}";
    }
}
