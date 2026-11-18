<?php

declare(strict_types=1);

namespace Domain\Documents\Models;

use App\Actors\Contracts\Actor;
use App\Actors\Enums\ActorType;
use App\Links\Support\Linkable;
use App\Numbers\Contracts\Numbered;
use App\Numbers\Support\HasNumber;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Domain\Documents\Data\CloseCard;
use Domain\Documents\Data\DockCard;
use Domain\Documents\Data\DocumentCard;
use Domain\Documents\Data\DocumentView;
use Domain\Documents\Enums\AttentionState;
use Domain\Documents\Exceptions\DocumentMissing;
use Domain\Documents\Models\Concerns\CreatedWithAttention;
use Domain\Documents\Models\Concerns\Settles;
use Domain\Documents\Support\MarkdownText;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

/**
 * A document: lasting knowledge kept as numbered revisions. It keeps no copy of its text; its current text is its
 * highest revision.
 *
 * @property string $id
 * @property int $number
 * @property ActorType $creator_type
 * @property string $creator_id
 * @property string|null $origin_agent_id
 * @property string|null $origin_session_id
 * @property AttentionState $attention
 * @property string|null $current_revision_id
 * @property Carbon|null $created_at
 */
#[Fillable(['creator_type', 'creator_id', 'origin_agent_id', 'origin_session_id'])]
final class Document extends Model implements Numbered, ReadableModel
{
    use BoundedReads, CreatedWithAttention, HasNumber, HasUlids, Linkable, Settles;

    public const string LINK_TYPE = 'documents.document';

    protected $attributes = ['attention' => 'active'];

    protected function casts(): array
    {
        return [
            'creator_type' => ActorType::class,
            'attention' => AttentionState::class,
            'created_at' => 'immutable_datetime',
            'updated_at' => 'immutable_datetime',
        ];
    }

    /**
     * A new document with the given text as its closed revision 1.
     */
    public static function publish(string $title, string $abstract, MarkdownText $body, Actor $author): self
    {
        $document = self::query()->create([
            'creator_type' => $author->actorType(),
            'creator_id' => $author->actorId(),
            'origin_agent_id' => $author->actorType() === ActorType::Agent ? $author->actorId() : null,
        ]);
        $document->addRevision($title, $abstract, $body->text, $author->actorType(), $author->actorId(), null);

        return $document;
    }

    /**
     * Adds the next revision and makes it the document's current one.
     */
    public function addRevision(string $title, string $abstract, string $body, ActorType $authorType, string $authorId, string|null $sessionId): DocumentRevision
    {
        $revision = $this->revisions()->create([
            'title' => $title,
            'abstract' => $abstract,
            'body' => $body,
            'author_type' => $authorType,
            'author_id' => $authorId,
            'session_id' => $sessionId,
            'closed_at' => CarbonImmutable::now(),
        ]);
        $this->current_revision_id = $revision->id;
        $this->save();
        $this->setRelation('currentRevision', $revision);

        return $revision;
    }

    /**
     * A settled document asks for attention again once a changed revision is published; its settlements stay.
     */
    public function reactivate(): void
    {
        if ($this->attention === AttentionState::Settled) {
            $this->attention = AttentionState::Active;
            $this->save();
        }
    }

    /**
     * How the document's drafts ended, newest first.
     *
     * @return list<CloseCard>
     */
    public function closes(): array
    {
        return array_values(DocumentClose::query()->where('document_id', $this->id)->orderByDesc('closed_at')->orderByDesc('id')->get()
            ->map(fn (DocumentClose $close) => $close->card())->all());
    }

    public function card(): DocumentCard
    {
        $revision = $this->currentRevisionOrFail();

        return DocumentCard::from(['id' => $this->id, 'number' => (string) $this->number, 'title' => $revision->title, 'abstract' => $revision->abstract, 'attention' => $this->attention]);
    }

    /**
     * The document as a search found it: its card with a snippet of the revision that holds the words.
     */
    public function hit(string $words, DocumentRevision $found): DocumentCard
    {
        $revision = $this->currentRevisionOrFail();

        return DocumentCard::from([
            'id' => $this->id,
            'number' => (string) $this->number,
            'title' => $revision->title,
            'abstract' => $revision->abstract,
            'attention' => $this->attention,
            'snippet' => $found->snippetFor($words),
            'foundIn' => "revision {$found->number}",
        ]);
    }

    /**
     * The newest revision a search loaded into the relation it searched.
     */
    public function foundRevision(string $relation): DocumentRevision
    {
        $found = $relation === 'revisions' ? $this->revisions->sortByDesc('number')->first() : $this->currentRevision;

        return $found ?? $this->currentRevisionOrFail();
    }

    public function dockCard(): DockCard
    {
        $revision = $this->currentRevisionOrFail();

        return DockCard::from(['type' => 'doc', 'number' => (string) $this->number, 'title' => $revision->title, 'abstract' => $revision->abstract, 'route' => "/documents/docs/{$this->number}"]);
    }

    public function view(): DocumentView
    {
        $revision = $this->currentRevisionOrFail();

        return new DocumentView(
            $this->id,
            (string) $this->number,
            $revision->title,
            $revision->abstract,
            $revision->body,
            (string) $revision->number,
            $this->creator_type->value,
            $this->creator_id,
            $this->attention,
            (string) $this->created_at?->toIso8601String(),
        );
    }

    /**
     * The document of this number, locked for the transaction: the one lock every writer of a document takes first.
     *
     * @throws DocumentMissing
     */
    public static function lockedForEditing(int $number): self
    {
        return self::query()->with('currentRevision')->where('number', $number)->lockForUpdate()->first() ?? throw DocumentMissing::numbered($number);
    }

    /**
     * The close already recorded for a draft token of this document, which a repeated close answers with.
     */
    public function closeOf(string $token): DocumentClose|null
    {
        return DocumentClose::query()->where('document_id', $this->id)->where('token', $token)->first();
    }

    /**
     * @return HasOne<DocumentDraft, $this>
     */
    public function draft(): HasOne
    {
        return $this->hasOne(DocumentDraft::class);
    }

    /**
     * @return HasMany<DocumentRevision, $this>
     */
    public function revisions(): HasMany
    {
        return $this->hasMany(DocumentRevision::class);
    }

    /**
     * The revision the document shows now: the last one published.
     *
     * @return BelongsTo<DocumentRevision, $this>
     */
    public function currentRevision(): BelongsTo
    {
        return $this->belongsTo(DocumentRevision::class, 'current_revision_id');
    }

    /**
     * Every document: documents are published to every signed-in actor.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function sharedPublished(Builder $query): void
    {
        $query->whereHas('revisions', fn (Builder $revisions) => $revisions->whereNotNull('closed_at'));
    }

    /**
     * The current revision; every published document has one from the moment it is created.
     */
    public function currentRevisionOrFail(): DocumentRevision
    {
        return $this->currentRevision ?? throw DocumentMissing::numbered($this->number);
    }
}
