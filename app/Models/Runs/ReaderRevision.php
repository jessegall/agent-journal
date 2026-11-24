<?php

declare(strict_types=1);

namespace App\Models\Runs;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Exceptions\ReaderDefinitionInvalid;
use App\Exceptions\RevisionImmutable;
use App\Models\CommandRules\CommandRequest;
use App\Support\ActorIdentity;
use App\Values\ReaderDefinition;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * One immutable revision of a reader for an operation: the command request and declaration revision it was proposed
 * for, its declarative definition, the output contract it reads under, and who wrote it. It is a draft until a
 * ReaderProof proves it; it is never updated, so a change is a new revision that needs its own proof (story 188).
 *
 * @property string $id
 * @property string $project_key
 * @property string $command_request_id
 * @property int $declaration_revision
 * @property string $operation
 * @property string $contract_label
 * @property array<string, mixed> $definition
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
    'actor_type',
    'actor_id',
])]
final class ReaderRevision extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    public const null UPDATED_AT = null;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['definition' => 'array', 'declaration_revision' => 'integer'];
    }

    /**
     * A draft reader for the request's operation, written for one declaration revision and its output contract.
     */
    public static function create(
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
            'actor_type' => $author->type->value,
            'actor_id' => $author->id,
        ]);
    }

    protected static function booted(): void
    {
        self::updating(fn (self $revision) => throw RevisionImmutable::reader($revision->id));
    }

    public function isProven(): bool
    {
        return $this->proofs()->exists();
    }

    // ----------[ Answers ]----------

    /**
     * @throws ReaderDefinitionInvalid
     */
    public function readerDefinition(): ReaderDefinition
    {
        return ReaderDefinition::fromArray($this->definition);
    }

    // ----------[ Accessors ]----------

    // ----------[ Relations ]----------

    /**
     * @return HasMany<ReaderProof, $this>
     */
    public function proofs(): HasMany
    {
        return $this->hasMany(ReaderProof::class);
    }

    /**
     * @return BelongsTo<CommandRequest, $this>
     */
    public function commandRequest(): BelongsTo
    {
        return $this->belongsTo(CommandRequest::class);
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofProject(Builder $query, string $projectKey): void
    {
        $query->where('project_key', $projectKey);
    }
}
