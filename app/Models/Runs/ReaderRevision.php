<?php

declare(strict_types=1);

namespace App\Models\Runs;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Exceptions\RevisionImmutable;
use App\Models\CommandRules\CommandRequest;
use App\Models\Support\JournalModel;
use App\Models\Support\ProjectMembership;
use App\Projects\Contracts\ProjectOwned;
use App\Records\Contracts\ReadableModel;
use App\Support\ActorReference;
use App\Values\ReaderDefinition;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property string $id
 * @property string $project_id
 * @property string $command_request_id
 * @property int $declaration_revision
 * @property string $operation
 * @property string $contract_label
 * @property ReaderDefinition $definition
 * @property string $actor_type
 * @property string $actor_id
 * @property CarbonImmutable $created_at
 * @property-read CommandRequest $commandRequest
 * @property-read Collection<int, ReaderProof> $proofs
 * @property-read int|null $proofs_count
 *
 * @mixin \Eloquent
 */
final class ReaderRevision extends JournalModel implements ProjectOwned, ReadableModel
{
    use BoundedReads;
    use Linkable;
    use ProjectMembership;

    public const null UPDATED_AT = null;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'definition' => ReaderDefinition::class,
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
        ActorReference $author,
    ): self {
        $readerRevision = new self();
        $readerRevision->project_id = $request->project_id;
        $readerRevision->command_request_id = $request->id;
        $readerRevision->declaration_revision = $declarationRevision;
        $readerRevision->operation = $request->operation;
        $readerRevision->contract_label = $contractLabel;
        $readerRevision->definition = $definition;
        $readerRevision->actor_type = $author->type;
        $readerRevision->actor_id = $author->id;
        $readerRevision->save();

        return $readerRevision;
    }

    public function isProven(): bool
    {
        return $this->proofs()->exists();
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
     * The rows of the given command request.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofCommandRequest(Builder $query, string $requestId): void
    {
        $query->where('command_request_id', $requestId);
    }
}
