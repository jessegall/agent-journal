<?php

declare(strict_types=1);

namespace App\Processes\Models;

use App\Actors\Support\ActorIdentity;
use App\Links\Support\Linkable;
use App\Processes\Exceptions\ReaderDefinitionInvalid;
use App\Processes\Exceptions\ReaderRevisionImmutable;
use App\Processes\Values\ReaderDefinition;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * One immutable revision of a reader for an operation: its declarative definition, the output contract it reads
 * under, and who wrote it. It is never updated; a change is a new revision.
 *
 * @property string $id
 * @property string $operation
 * @property string $contract_label
 * @property array<string, mixed> $definition
 * @property string $actor_type
 * @property string $actor_id
 * @property Carbon $created_at
 */
#[Fillable(['operation', 'contract_label', 'definition', 'actor_type', 'actor_id'])]
final class ReaderRevision extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids, Linkable;

    public const null UPDATED_AT = null;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['definition' => 'array'];
    }

    public static function write(string $operation, string $contractLabel, ReaderDefinition $definition, ActorIdentity $author): self
    {
        return self::query()->create([
            'operation' => $operation,
            'contract_label' => $contractLabel,
            'definition' => $definition->toArray(),
            'actor_type' => $author->type->value,
            'actor_id' => $author->id,
        ]);
    }

    /**
     * @throws ReaderDefinitionInvalid
     */
    public function readerDefinition(): ReaderDefinition
    {
        return ReaderDefinition::fromArray($this->definition);
    }

    protected static function booted(): void
    {
        self::updating(fn (self $revision) => throw ReaderRevisionImmutable::forRevision($revision->id));
    }
}
