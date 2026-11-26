<?php

declare(strict_types=1);

namespace Domain\Documents\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Models\Support\Accessor;
use App\Models\Support\JournalModel;
use App\Support\ActorReference;
use App\Support\MarkdownText;
use Carbon\CarbonImmutable;
use Domain\Documents\Events\DraftKept;
use Domain\Documents\Exceptions\RecordImmutable;
use Domain\Documents\Support\DraftText;
use Domain\Documents\Values\RetainedDraftView;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;

/**
 * @property string $id
 * @property string $document_id
 * @property int $base_revision_number
 * @property string $title
 * @property string $abstract
 * @property string $body
 * @property string $reason
 * @property string $author_type
 * @property string $author_id
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read mixed $view
 * @property-read mixed $working_text
 *
 * @mixin \Eloquent
 */
final class RetainedDraft extends JournalModel implements EventSource, ReadableModel
{
    use BoundedReads;
    use Linkable;
    use RaisesEvents;

    public const string DRAFT_SCOPE = 'private_draft';

    protected function casts(): array
    {
        return [];
    }

    protected static function booted(): void
    {
        self::updating(fn (self $draft) => $draft->assertUnedited());
    }

    // ----------[ Constructors ]----------

    public static function create(DocumentDraft $draft, string $reason, ActorReference|null $parent): self
    {
        $kept = new self();
        $kept->document_id = $draft->document_id;
        $kept->base_revision_number = $draft->base_revision_number;
        $kept->title = $draft->title;
        $kept->abstract = $draft->abstract;
        $kept->body = $draft->body;
        $kept->reason = $reason;
        $kept->author_type = $draft->author_type;
        $kept->author_id = $draft->author_id;

        $kept->saveAndAssert();
        $kept->raise(new DraftKept($kept->id, $kept->document_id, $parent));

        return $kept;
    }

    // ----------[ Accessors ]----------

    /**
     * @return Attribute<RetainedDraftView, never>
     */
    protected function view(): Attribute
    {
        return Accessor::get(fn () => new RetainedDraftView(
            $this->id,
            $this->document_id,
            $this->base_revision_number,
            $this->body,
            $this->reason,
        ));
    }

    /**
     * @return Attribute<DraftText, never>
     */
    protected function workingText(): Attribute
    {
        return Accessor::get(
            fn () => new DraftText($this->title, $this->abstract, MarkdownText::workingBody($this->body)),
        );
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses every edit: a retained draft stays as it was written.
     *
     * @throws RecordImmutable
     */
    private function assertUnedited(): never
    {
        throw RecordImmutable::for('retained draft');
    }

    // ----------[ Queries ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function forRecovery(Builder $query): void
    {
        $query->withoutGlobalScope(self::DRAFT_SCOPE);
    }
}
