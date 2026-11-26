<?php

declare(strict_types=1);

namespace Domain\Documents\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Models\Agents\Agent;
use App\Models\Support\Accessor;
use App\Models\Support\JournalModel;
use App\Support\ActorReference;
use App\Support\MarkdownText;
use Carbon\CarbonImmutable;
use Domain\Documents\Data\DraftView;
use Domain\Documents\Events\DocumentDraftSaved;
use Domain\Documents\Events\DocumentOpened;
use Domain\Documents\Support\DraftText;
use Domain\Documents\Support\RecordViews;
use Domain\Documents\Values\DraftReference;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

/**
 * @property string $id
 * @property string $document_id
 * @property string $token
 * @property string $author_type
 * @property string $author_id
 * @property int $base_revision_number
 * @property int $version
 * @property string $title
 * @property string $abstract
 * @property string $body
 * @property CarbonImmutable $opened_at
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read Document $document
 * @property-read mixed $holder_label
 *
 * @mixin \Eloquent
 */
final class DocumentDraft extends JournalModel implements EventSource, ReadableModel
{
    use BoundedReads;
    use Linkable;
    use RaisesEvents;

    protected $attributes = ['version' => 1];

    protected function casts(): array
    {
        return [
            'base_revision_number' => 'integer',
            'version' => 'integer',
            'opened_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * Opens the draft of a locked document for this editor, starting from its current revision.
     */
    public static function create(Document $document, DocumentRevision $baseRevision, ActorReference $editor): self
    {
        $draft = new self();
        $draft->document_id = $document->id;
        $draft->token = Str::random(40);
        $draft->author_type = $editor->type;
        $draft->author_id = $editor->id;
        $draft->base_revision_number = $baseRevision->number;
        $draft->title = $baseRevision->title;
        $draft->abstract = $baseRevision->abstract;
        $draft->body = $baseRevision->body;
        $draft->opened_at = CarbonImmutable::now();

        $draft->saveAndAssert();
        $draft->raise(new DocumentOpened($document->id, $document->number));

        return $draft;
    }

    // ----------[ Mutations ]----------

    /**
     * Saves new text and counts the save in the version.
     */
    public function saveText(DraftText $text): void
    {
        $this->title = $text->title;
        $this->abstract = $text->abstract;
        $this->body = $text->body->text;
        $this->version++;
        $this->saveAndAssert();
        $this->raise(new DocumentDraftSaved($this->document_id, $this->version));
    }

    // ----------[ Predicates ]----------

    public function isEditedBy(ActorReference $editor): bool
    {
        return $this->author_type === $editor->type && $this->author_id === $editor->id;
    }

    public function isAtVersion(int $version): bool
    {
        return $this->version === $version;
    }

    public function hasChangesFrom(DocumentRevision $baseRevision): bool
    {
        return $this->title !== $baseRevision->title
            || $this->abstract !== $baseRevision->abstract
            || $this->body !== $baseRevision->body;
    }

    // ----------[ Transformers ]----------

    public function view(Document $document): DraftView
    {
        return RecordViews::draftView($this, $document);
    }

    public function reference(Document $document): DraftReference
    {
        return new DraftReference(
            $document->id,
            $document->number,
            $this->token,
            $this->version,
            $this->base_revision_number,
            MarkdownText::workingBody($this->body)->outline(),
        );
    }

    // ----------[ Accessors ]----------

    /**
     * Who holds the draft, as others see it: never its text.
     *
     * @return Attribute<non-falsy-string, never>
     */
    protected function holderLabel(): Attribute
    {
        return Accessor::get(fn () => "{$this->author_type} {$this->author_id}");
    }

    // ----------[ Relations ]----------

    /**
     * @return BelongsTo<Document, $this>
     */
    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }

    // ----------[ Scopes ]----------

    /**
     * The draft an agent holds, which closes when the agent's session ends.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function heldByAgent(Builder $query, string $agentId): void
    {
        $query->where('author_type', Agent::storedType())->where('author_id', $agentId);
    }

    /**
     * The rows of the given token.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withToken(Builder $query, string $token): void
    {
        $query->where('token', $token);
    }

    /**
     * The rows of the given document.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofDocument(Builder $query, string $documentId): void
    {
        $query->where('document_id', $documentId);
    }

    /**
     * The rows of the given author.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofAuthor(Builder $query, string $authorId): void
    {
        $query->where('author_id', $authorId);
    }

    /**
     * The rows of the given author type.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withAuthorType(Builder $query, string $authorType): void
    {
        $query->where('author_type', $authorType);
    }

    /**
     * The rows with their document loaded.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withDocument(Builder $query): void
    {
        $query->with('document');
    }
}
