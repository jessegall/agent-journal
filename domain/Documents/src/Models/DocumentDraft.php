<?php

declare(strict_types=1);

namespace Domain\Documents\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\EventSource;
use App\Contracts\ReadableModel;
use App\Enums\ActorType;
use App\Support\ActorIdentity;
use App\Support\MarkdownText;
use Carbon\CarbonImmutable;
use Domain\Documents\Data\DraftView;
use Domain\Documents\Events\DocumentDraftSaved;
use Domain\Documents\Events\DocumentOpened;
use Domain\Documents\Support\DraftText;
use Domain\Documents\Support\RecordViews;
use Domain\Documents\Values\DraftReference;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * The one open draft of a document: its editor, the revision it started from, a version that counts its saves,
 * and its text. Closing it publishes a revision only when the text changed.
 *
 * @property string $id
 * @property string $document_id
 * @property string $token
 * @property ActorType $author_type
 * @property string $author_id
 * @property int $base_revision_number
 * @property int $version
 * @property string $title
 * @property string $abstract
 * @property string $body
 * @property Carbon|null $updated_at
 */
#[Fillable(
    [
        'document_id',
        'token',
        'author_type',
        'author_id',
        'base_revision_number',
        'title',
        'abstract',
        'body',
        'opened_at',
    ],
)]
final class DocumentDraft extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    public const string LINK_TYPE = 'documents.draft';

    protected $attributes = ['version' => 1];

    // ----------[ Constructors ]----------

    protected function casts(): array
    {
        return [
            'author_type' => ActorType::class,
            'base_revision_number' => 'integer',
            'version' => 'integer',
            'opened_at' => 'immutable_datetime',
        ];
    }

    /**
     * Opens the draft of a locked document for this editor, starting from its current revision.
     */
    public static function create(Document $document, DocumentRevision $baseRevision, ActorIdentity $editor): self
    {
        $draft = new self([
            'document_id' => $document->id,
            'token' => Str::random(40),
            'author_type' => $editor->type,
            'author_id' => $editor->id,
            'base_revision_number' => $baseRevision->number,
            'title' => $baseRevision->title,
            'abstract' => $baseRevision->abstract,
            'body' => $baseRevision->body,
            'opened_at' => CarbonImmutable::now(),
        ]);

        $draft->assertSaved($draft->save());
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
        $this->assertSaved($this->save());
        $this->raise(new DocumentDraftSaved($this->document_id, $this->version));
    }

    // ----------[ Answers ]----------

    public function isEditedBy(ActorIdentity $editor): bool
    {
        return $this->author_type === $editor->type && $this->author_id === $editor->id;
    }

    public function isAtVersion(int $version): bool
    {
        return $this->version === $version;
    }

    public function view(Document $document): DraftView
    {
        return RecordViews::draftView($this, $document);
    }

    /**
     * Who holds the draft, as others see it: never its text.
     */
    public function holderLabel(): string
    {
        return "{$this->author_type->value} {$this->author_id}";
    }

    public function hasChangesFrom(DocumentRevision $baseRevision): bool
    {
        return $this->title !== $baseRevision->title
            || $this->abstract !== $baseRevision->abstract
            || $this->body !== $baseRevision->body;
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
        $query->where('author_type', ActorType::Agent->value)->where('author_id', $agentId);
    }
}
