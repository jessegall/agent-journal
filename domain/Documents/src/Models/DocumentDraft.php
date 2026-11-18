<?php

declare(strict_types=1);

namespace Domain\Documents\Models;

use App\Actors\Contracts\Actor;
use App\Actors\Enums\ActorType;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Domain\Documents\Api\DraftReference;
use Domain\Documents\Data\DraftView;
use Domain\Documents\Enums\CloseCause;
use Domain\Documents\Exceptions\DraftConflict;
use Domain\Documents\Support\DraftText;
use Domain\Documents\Support\Editor;
use Domain\Documents\Support\MarkdownText;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
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
 * @property string|null $session_id
 * @property int $base_revision_number
 * @property int $version
 * @property string $title
 * @property string $abstract
 * @property string $body
 */
#[Fillable(['document_id', 'token', 'author_type', 'author_id', 'session_id', 'base_revision_number', 'title', 'abstract', 'body', 'opened_at'])]
final class DocumentDraft extends Model implements ReadableModel
{
    use BoundedReads, HasUlids, Linkable;

    public const string LINK_TYPE = 'documents.draft';

    protected $attributes = ['version' => 1];

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
    public static function openFor(Document $document, DocumentRevision $base, Editor $editor): self
    {
        return self::query()->create([
            'document_id' => $document->id,
            'token' => Str::random(40),
            'author_type' => $editor->type(),
            'author_id' => $editor->id(),
            'session_id' => $editor->sessionId,
            'base_revision_number' => $base->number,
            'title' => $base->title,
            'abstract' => $base->abstract,
            'body' => $base->body,
            'opened_at' => CarbonImmutable::now(),
        ]);
    }

    /**
     * @return BelongsTo<Document, $this>
     */
    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }

    /**
     * @throws DraftConflict
     */
    public function requireEditor(Editor $editor): void
    {
        $isTheEditor = $this->author_type === $editor->type() && $this->author_id === $editor->id() && $this->session_id === $editor->sessionId;

        if (! $isTheEditor) {
            throw DraftConflict::notYours();
        }
    }

    /**
     * @throws DraftConflict
     */
    public function requireVersion(int $version): void
    {
        if ($this->version !== $version) {
            throw DraftConflict::stale($version, $this->version);
        }
    }

    /**
     * Saves new text and counts the save in the version.
     */
    public function saveText(DraftText $text): void
    {
        $this->title = $text->title;
        $this->abstract = $text->abstract;
        $this->body = $text->body->text;
        $this->version++;
        $this->save();
    }

    public function view(Document $document): DraftView
    {
        return DraftView::from([
            'documentNumber' => (string) $document->number,
            'token' => $this->token,
            'version' => $this->version,
            'baseRevisionNumber' => (string) $this->base_revision_number,
            'title' => $this->title,
            'abstract' => $this->abstract,
            'body' => $this->body,
        ]);
    }

    /**
     * Who holds the draft, as others see it: never its text.
     */
    public function holderLabel(): string
    {
        return "{$this->author_type->value} {$this->author_id}";
    }

    public function hasChangesFrom(DocumentRevision $base): bool
    {
        return $this->title !== $base->title || $this->abstract !== $base->abstract || $this->body !== $base->body;
    }

    public function reference(Document $document): DraftReference
    {
        return new DraftReference($document->id, $document->number, $this->token, $this->version, $this->base_revision_number, MarkdownText::body($this->body)->outline());
    }

    /**
     * Closes the draft inside the caller's transaction, under the document's lock: a revision with the next number
     * when the text changed, a close record either way, and the draft gone.
     */
    public function closeInto(Document $document, DocumentRevision $base, CloseCause $cause, Actor|null $closer, string|null $reason): DocumentClose
    {
        $published = $this->hasChangesFrom($base);
        $resultNumber = $published ? $document->revisions()->create([
            'title' => $this->title,
            'abstract' => $this->abstract,
            'body' => $this->body,
            'author_type' => $this->author_type,
            'author_id' => $this->author_id,
            'session_id' => $this->session_id,
            'closed_at' => CarbonImmutable::now(),
        ])->number : $base->number;
        $close = DocumentClose::record($this, $resultNumber, $cause, $closer, $reason, $published);
        $this->delete();

        return $close;
    }
}
