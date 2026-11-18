<?php

declare(strict_types=1);

namespace App\Processes\Models;

use App\Actors\Support\ActorIdentity;
use App\Links\Support\Linkable;
use App\Processes\Enums\ReaderState;
use App\Processes\Exceptions\ReaderDefinitionInvalid;
use App\Processes\Exceptions\RevisionImmutable;
use App\Processes\Values\ReaderDefinition;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * One immutable revision of a reader for an operation: the command request and declaration revision it was proposed
 * for, its declarative definition, the output contract it reads under, who wrote it, and whether it is still a draft.
 * It is never updated; a change is a new revision.
 *
 * @property string $id
 * @property string $project_key
 * @property string $command_request_id
 * @property int $declaration_revision
 * @property string $operation
 * @property string $contract_label
 * @property array<string, mixed> $definition
 * @property ReaderState $state
 * @property string $actor_type
 * @property string $actor_id
 * @property Carbon $created_at
 */
#[Fillable([
    'project_key',
    'command_request_id',
    'declaration_revision',
    'operation',
    'contract_label',
    'definition',
    'state',
    'actor_type',
    'actor_id',
])]
final class ReaderRevision extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids, Linkable;

    public const null UPDATED_AT = null;

    /**
     * A draft reader for the request's operation, written for one declaration revision and its output contract.
     */
    public static function propose(
        CommandRequest $request,
        int $declarationRevision,
        string $contractLabel,
        ReaderDefinition $definition,
        ActorIdentity $author,
    ): self {
        return self::query()->create([
            'project_key' => $request->project_key,
            'command_request_id' => $request->id,
            'declaration_revision' => $declarationRevision,
            'operation' => $request->operation,
            'contract_label' => $contractLabel,
            'definition' => $definition->toArray(),
            'state' => ReaderState::Draft,
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

    /**
     * @return BelongsTo<CommandRequest, $this>
     */
    public function commandRequest(): BelongsTo
    {
        return $this->belongsTo(CommandRequest::class);
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['definition' => 'array', 'declaration_revision' => 'integer', 'state' => ReaderState::class];
    }

    protected static function booted(): void
    {
        self::updating(fn (self $revision) => throw RevisionImmutable::reader($revision->id));
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofProject(Builder $query, string $projectKey): void
    {
        $query->where('project_key', $projectKey);
    }
}
