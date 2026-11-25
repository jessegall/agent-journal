<?php

declare(strict_types=1);

namespace Domain\Documents\Models;

use App\Concerns\BoundedReads;
use App\Concerns\HasComments;
use App\Concerns\HasNumber;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Actors\Actor;
use App\Contracts\Events\EventSource;
use App\Contracts\Reads\TextContent;
use App\Contracts\Records\Commentable;
use App\Contracts\Records\Numbered;
use App\Contracts\Records\ReadableModel;
use App\Contracts\Sharing\Shareable;
use App\Enums\ActorType;
use App\Support\ActorContext;
use App\Support\Cards\DockCard;
use App\Support\Cards\DockIdentity;
use App\Support\MarkdownText;
use App\Support\ShareRecordCard;
use App\Support\Sources\Contracts\CardContext;
use App\Support\Sources\Contracts\Dockable;
use App\Support\Sources\DockDefinition;
use App\Values\TextVersion;
use Carbon\CarbonImmutable;
use Domain\Documents\Data\DockSuggestion;
use Domain\Documents\Data\PublicationCard;
use Domain\Documents\Data\ReportView;
use Domain\Documents\Enums\AttentionState;
use Domain\Documents\Events\ReportFiled;
use Domain\Documents\Exceptions\RecordImmutable;
use Domain\Documents\Exceptions\ReportMissing;
use Domain\Documents\Models\Concerns\CreatedWithAttention;
use Domain\Documents\Models\Concerns\MeasuresBody;
use Domain\Documents\Models\Concerns\SearchesText;
use Domain\Documents\Models\Concerns\Settles;
use Domain\Documents\Models\Concerns\SharedWithComments;
use Domain\Documents\Support\Cards\ReportDockCard;
use Domain\Documents\Support\RecordViews;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * A report: what was checked or found at one moment, filed once. Only whether it still asks for attention changes.
 *
 * @property string $id
 * @property int $number
 * @property string $title
 * @property string $abstract
 * @property string $body
 * @property ActorType $creator_type
 * @property string $creator_id
 * @property Carbon $filed_at
 * @property AttentionState $attention
 */
#[Fillable(['title', 'abstract', 'body', 'creator_type', 'creator_id', 'filed_at'])]
final class Report extends Model implements Commentable, Dockable, EventSource, Numbered, ReadableModel, Shareable, TextContent
{
    use BoundedReads;
    use CreatedWithAttention;
    use HasComments;
    use HasNumber;
    use HasUlids;
    use Linkable;
    use MeasuresBody;
    use RaisesEvents;
    use SearchesText;
    use Settles;
    use SharedWithComments;

    public const string LINK_TYPE = 'documents.report';

    protected $attributes = ['attention' => 'active'];

    protected function casts(): array
    {
        return [
            'creator_type' => ActorType::class,
            'attention' => AttentionState::class,
            'filed_at' => 'immutable_datetime',
        ];
    }

    protected static function booted(): void
    {
        self::updating(fn (self $report) => $report->assertOnlyAttentionEdited());
    }

    // ----------[ Constructors ]----------

    /**
     * A new report, filed now with the given text.
     */
    public static function create(string $title, string $abstract, MarkdownText $body, Actor $author): self
    {
        $report = new self([
            'title' => trim($title),
            'abstract' => trim($abstract),
            'body' => $body->text,
            'creator_type' => $author->actorType(),
            'creator_id' => $author->actorId(),
            'filed_at' => CarbonImmutable::now(),
        ]);

        $report->assertSaved($report->save());
        $report->raise(new ReportFiled($report->id, $report->number, ActorContext::of($author)));

        return $report;
    }

    // ----------[ Accessors ]----------

    /**
     * @return Attribute<PublicationCard, never>
     */
    protected function card(): Attribute
    {
        return Attribute::get(fn () => RecordViews::reportCard($this))->withoutObjectCaching();
    }

    /**
     * @return Attribute<DockSuggestion, never>
     */
    protected function dockCard(): Attribute
    {
        return Attribute::get(fn () => RecordViews::reportSuggestion($this))->withoutObjectCaching();
    }

    /**
     * @return Attribute<ReportView, never>
     */
    protected function view(): Attribute
    {
        return Attribute::get(fn () => RecordViews::reportView($this))->withoutObjectCaching();
    }

    /**
     * The report's safe card for a share; a filed report never changes, so its published version is always 1.
     *
     * @return Attribute<ShareRecordCard, never>
     */
    protected function shareCard(): Attribute
    {
        return Attribute::get(
            fn () => new ShareRecordCard($this->shareIdentity(), $this->title, '1'),
        )->withoutObjectCaching();
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

    /**
     * Refuses a number or id no report holds.
     *
     * @phpstan-assert self $report
     *
     * @throws ReportMissing
     */
    private static function assertFound(self|null $report, int|string $reference): void
    {
        if ($report !== null) {
            return;
        }

        if (is_int($reference)) {
            throw ReportMissing::numbered($reference);
        }

        throw ReportMissing::identified($reference);
    }

    // ----------[ Queries ]----------

    public static function lockedForClosing(int|string $reference): self
    {
        $reports = self::query()->lockForUpdate();

        if (is_int($reference)) {
            $report = $reports->numberedInJournal($reference)->first();
            self::assertFound($report, $reference);

            return $report;
        }

        $report = $reports->whereKey($reference)->first();
        self::assertFound($report, $reference);

        return $report;
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

    public function identifyFor(DockDefinition $definition): DockIdentity
    {
        return $definition->identity($this->id);
    }

    /**
     * Its card in a dock: what it is called and where it stands, with Open when the viewer may open it.
     */
    public function composeDockCard(CardContext $context): DockCard
    {
        return new ReportDockCard($this, $context)->card;
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
}
