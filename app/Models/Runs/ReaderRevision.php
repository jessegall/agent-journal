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
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $project_key
 * @property string $command_request_id
 * @property int $declaration_revision
 * @property string $operation
 * @property string $contract_label
 * @property array $definition
 * @property string $actor_type
 * @property string $actor_id
 * @property Carbon $created_at
 * @property CommandRequest $commandRequest
 * @property Collection<int, ReaderProof>|ReaderProof[] $proofs
 */
final class ReaderRevision extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    public const null UPDATED_AT = null;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'definition' => 'array',
            'declaration_revision' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        self::updating(fn (self $revision) => $revision->assertUnedited());
    }

    // ----------[ Constructors ]----------

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
        $readerRevision = new self();
        $readerRevision->project_key = $request->project_key;
        $readerRevision->command_request_id = $request->id;
        $readerRevision->declaration_revision = $declarationRevision;
        $readerRevision->operation = $request->operation;
        $readerRevision->contract_label = $contractLabel;
        $readerRevision->definition = $definition->toArray();
        $readerRevision->actor_type = $author->type;
        $readerRevision->actor_id = $author->id;
        $readerRevision->save();

        return $readerRevision;
    }

    public function isProven(): bool
    {
        return $this->proofs()->exists();
    }

    // ----------[ Transformers ]----------

    /**
     * @throws ReaderDefinitionInvalid
     */
    public function readerDefinition(): ReaderDefinition
    {
        return ReaderDefinition::fromArray($this->definition);
    }

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

    // ----------[ Asserts ]----------

    /**
     * Refuses every edit: it stays as it was written.
     *
     * @throws RevisionImmutable
     */
    private function assertUnedited(): never
    {
        throw RevisionImmutable::reader($this->id);
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

    /**
     * The rows of the given command request.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofCommandRequest(Builder $query, string $commandRequestId): void
    {
        $query->where('command_request_id', $commandRequestId);
    }
}
