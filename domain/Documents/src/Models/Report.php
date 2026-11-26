<?php

declare(strict_types=1);

namespace Domain\Documents\Models;

use App\Actors\Contracts\Actor;
use App\Concerns\BoundedReads;
use App\Concerns\HasNumber;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Models\Support\Accessor;
use App\Models\Support\BelongsToProject;
use App\Models\Support\JournalModel;
use App\Projects\Contracts\ProjectOwned;
use App\Reads\Contracts\TextContent;
use App\Records\Contracts\Commentable;
use App\Records\Contracts\Numbered;
use App\Records\Contracts\ReadableModel;
use App\Records\Contracts\Shareable;
use App\Support\ActorReference;
use App\Support\MarkdownText;
use App\Support\ShareRecordCard;
use App\Values\ProjectOwner;
use App\Values\TextVersion;
use Carbon\CarbonImmutable;
use Closure;
use Domain\Documents\Data\DockSuggestion;
use Domain\Documents\Data\PublicationCard;
use Domain\Documents\Data\ReportView;
use Domain\Documents\Enums\AttentionStatus;
use Domain\Documents\Events\ReportFiled;
use Domain\Documents\Exceptions\RecordImmutable;
use Domain\Documents\Exceptions\ReportMissing;
use Domain\Documents\Models\Concerns\CreatedWithAttention;
use Domain\Documents\Models\Concerns\MeasuresBody;
use Domain\Documents\Models\Concerns\SearchesText;
use Domain\Documents\Models\Concerns\Settles;
use Domain\Documents\Models\Concerns\SharedWithComments;
use Domain\Documents\Support\RecordViews;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $project_id
 * @property string $number_group_id
 * @property int $number
 * @property string $title
 * @property string $abstract
 * @property string $body
 * @property string $creator_type
 * @property string $creator_id
 * @property CarbonImmutable $filed_at
 * @property AttentionStatus $attention
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read mixed $card
 * @property-read mixed $dock_card
 * @property-read mixed $share_card
 * @property-read mixed $view
 *
 * @mixin \Eloquent
 */
final class Report extends JournalModel implements
    Commentable,
    EventSource,
    Numbered,
    ProjectOwned,
    ReadableModel,
    Shareable,
    TextContent
{
    use BelongsToProject;
    use BoundedReads;
    use CreatedWithAttention;
    use HasNumber;
    use Linkable;
    use MeasuresBody;
    use OrdersById;
    use RaisesEvents;
    use SearchesText;
    use Settles;
    use SharedWithComments;

    protected $attributes = ['attention' => 'active'];

    protected function casts(): array
    {
        return [
            'attention' => AttentionStatus::class,
            'filed_at' => 'immutable_datetime',
        ];
    }

    protected static function booted(): void
    {
        self::updating(fn (self $report) => $report->assertOnlyAttentionEdited());
    }

    // ----------[ Constructors ]----------

    /**
     * A new report of the project, filed now with the given text.
     */
    public static function create(
        string $title,
        string $abstract,
        MarkdownText $body,
        Actor $author,
        ProjectOwner $owner,
    ): self {
        $report = new self();
        $report->project_id = $owner->projectId();
        $report->title = trim($title);
        $report->abstract = trim($abstract);
        $report->body = $body->text;
        $report->creator_type = $author->actorType();
        $report->creator_id = $author->actorId();
        $report->filed_at = CarbonImmutable::now();

        $report->saveAndAssert();
        $report->raise(new ReportFiled($report->id, $report->number, ActorReference::of($author)));

        return $report;
    }

    // ----------[ Accessors ]----------

    /**
     * @return Attribute<PublicationCard, never>
     */
    protected function card(): Attribute
    {
        return Accessor::get(fn () => RecordViews::reportCard($this));
    }

    /**
     * @return Attribute<DockSuggestion, never>
     */
    protected function dockCard(): Attribute
    {
        return Accessor::get(fn () => RecordViews::reportSuggestion($this));
    }

    /**
     * @return Attribute<ReportView, never>
     */
    protected function view(): Attribute
    {
        return Accessor::get(fn () => RecordViews::reportView($this));
    }

    /**
     * The report's safe card for a share; a filed report never changes, so its published version is always 1.
     *
     * @return Attribute<ShareRecordCard, never>
     */
    protected function shareCard(): Attribute
    {
        return Accessor::get(fn () => new ShareRecordCard($this->shareIdentity(), $this->title, '1'));
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses an edit of anything but a report's attention: what a report found stays as it was written.
     *
     * @throws RecordImmutable
     */
    private function assertOnlyAttentionEdited(): void
    {
        if (array_diff(array_keys($this->getDirty()), ['attention', 'updated_at']) !== []) {
            throw RecordImmutable::for('report');
        }
    }

    // ----------[ Queries ]----------

    public static function findLockedForClosing(int|string $reference): self
    {
        $reports = self::query()->lockForUpdate();

        if (is_int($reference)) {
            return $reports->numberedInJournal($reference)->firstOr(ReportMissing::throwing()->numbered($reference));
        }

        return $reports->whereKey($reference)->firstOr(ReportMissing::throwing()->identified($reference));
    }

    /**
     * The report as a search found it: its card with a snippet around the words.
     */
    public function searchResult(string $words): PublicationCard
    {
        return PublicationCard::from([
            ...$this->card->all(),
            'snippet' => $this->snippetFor($words),
            'foundIn' => 'report',
        ]);
    }

    /**
     * A report's text, filed once: version 1 is its only version.
     */
    public function textVersion(string|null $version = null): TextVersion
    {
        return TextVersion::ofOnlyMarkdown($version, 'Report', $this->body);
    }

    // ----------[ Scopes ]----------

    /**
     * Every report: reports are published to every signed-in actor.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function sharedPublished(Builder $query): void
    {
        $query->whereNotNull('filed_at');
    }

    /**
     * The rows of any of the given numbers.
     *
     * @param  Builder<self>  $query
     * @param  array<array-key, int>|Builder<covariant Model>|Closure  $numbers
     */
    #[Scope]
    protected function withAnyNumber(Builder $query, array|Builder|Closure $numbers): void
    {
        $query->whereIn('number', $numbers);
    }
}
