<?php

declare(strict_types=1);

namespace Domain\Documents\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\EventSource;
use App\Contracts\ReadableModel;
use App\Enums\ActorType;
use App\Support\ActorContext;
use App\Support\MarkdownText;
use Domain\Documents\Events\DraftKept;
use Domain\Documents\Exceptions\RecordImmutable;
use Domain\Documents\Support\DraftText;
use Domain\Documents\Values\RetainedDraftView;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $document_id
 * @property int $base_revision_number
 * @property string $title
 * @property string $abstract
 * @property string $body
 * @property string $reason
 * @property ActorType $author_type
 * @property string $author_id
 */
#[Fillable(['document_id', 'base_revision_number', 'title', 'abstract', 'body', 'reason', 'author_type', 'author_id'])]
final class RetainedDraft extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    public const string LINK_TYPE = 'documents.retained-draft';

    public const string DRAFT_SCOPE = 'private_draft';

    // ----------[ Constructors ]----------

    protected function casts(): array
    {
        return ['author_type' => ActorType::class];
    }

    protected static function booted(): void
    {
        self::updating(fn () => throw RecordImmutable::for('retained draft'));
    }

    public static function create(DocumentDraft $draft, string $reason, ActorContext|null $parent): self
    {
        $kept = new self([
            'document_id' => $draft->document_id,
            'base_revision_number' => $draft->base_revision_number,
            'title' => $draft->title,
            'abstract' => $draft->abstract,
            'body' => $draft->body,
            'reason' => $reason,
            'author_type' => $draft->author_type,
            'author_id' => $draft->author_id,
        ]);

        $kept->assertSaved($kept->save());
        $kept->raise(new DraftKept($kept->id, $kept->document_id, $parent));

        return $kept;
    }

    // ----------[ Queries ]----------

    /**
     * @return Builder<self>
     */
    public static function forRecovery(): Builder
    {
        return self::query()->withoutGlobalScope(self::DRAFT_SCOPE);
    }

    // ----------[ Answers ]----------

    public function view(): RetainedDraftView
    {
        return new RetainedDraftView(
            $this->id,
            $this->document_id,
            $this->base_revision_number,
            $this->body,
            $this->reason,
        );
    }

    public function workingText(): DraftText
    {
        return new DraftText($this->title, $this->abstract, MarkdownText::workingBody($this->body));
    }
}
