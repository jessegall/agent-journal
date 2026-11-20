<?php

declare(strict_types=1);

namespace Domain\Documents\Models;

use App\Actors\Contracts\Actor;
use App\Actors\Enums\ActorType;
use App\Comments\Contracts\Commentable;
use App\Comments\Support\HasComments;
use App\Links\Support\Linkable;
use App\Numbers\Contracts\Numbered;
use App\Numbers\Support\HasNumber;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Sharing\Contracts\Shareable;
use App\Sharing\Support\ShareRecordCard;
use App\Text\Contracts\TextContent;
use App\Text\Support\MarkdownText;
use App\Text\Values\TextVersion;
use Carbon\CarbonImmutable;
use Domain\Documents\Data\DockCard;
use Domain\Documents\Data\PublicationCard;
use Domain\Documents\Data\ReportView;
use Domain\Documents\Enums\AttentionState;
use Domain\Documents\Exceptions\RecordImmutable;
use Domain\Documents\Exceptions\ReportMissing;
use Domain\Documents\Models\Concerns\CreatedWithAttention;
use Domain\Documents\Models\Concerns\MeasuresBody;
use Domain\Documents\Models\Concerns\SearchesText;
use Domain\Documents\Models\Concerns\Settles;
use Domain\Documents\Models\Concerns\SharedWithComments;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
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
final class Report extends Model implements Commentable, Numbered, ReadableModel, Shareable, TextContent
{
    use BoundedReads;
    use CreatedWithAttention;
    use HasComments;
    use HasNumber;
    use HasUlids;
    use Linkable;
    use MeasuresBody;
    use SearchesText;
    use Settles;
    use SharedWithComments;

    public const string LINK_TYPE = 'documents.report';

    protected $attributes = ['attention' => 'active'];

    // ----------[ Constructors ]----------

    protected function casts(): array
    {
        return [
            'creator_type' => ActorType::class,
            'attention' => AttentionState::class,
            'filed_at' => 'immutable_datetime',
            'created_at' => 'immutable_datetime',
            'updated_at' => 'immutable_datetime',
        ];
    }

    /**
     * A new report, filed now with the given text.
     */
    public static function file(string $title, string $abstract, MarkdownText $body, Actor $author): self
    {
        return self::query()->create([
            'title' => trim($title),
            'abstract' => trim($abstract),
            'body' => $body->text,
            'creator_type' => $author->actorType(),
            'creator_id' => $author->actorId(),
            'filed_at' => CarbonImmutable::now(),
        ]);
    }

    protected static function booted(): void
    {
        self::updating(function (self $report): void {
            if (array_diff(array_keys($report->getDirty()), ['attention', 'updated_at']) !== []) {
                throw RecordImmutable::for('report');
            }
        });
    }

    // ----------[ Queries ]----------

    public static function lockedForClosing(int|string $reference): self
    {
        $reports = self::query()->lockForUpdate();
        if (is_int($reference)) {
            return $reports->where('number', $reference)->firstOr(fn () => throw ReportMissing::numbered($reference));
        }

        return $reports->whereKey($reference)->firstOr(fn () => throw ReportMissing::identified($reference));
    }

    // ----------[ Answers ]----------

    public function card(): PublicationCard
    {
        return PublicationCard::from([
            'id' => $this->id,
            'number' => (string) $this->number,
            'title' => $this->title,
            'abstract' => $this->abstract,
            'attention' => $this->attention,
        ]);
    }

    /**
     * The report as a search found it: its card with a snippet around the words.
     */
    public function searchResult(string $words): PublicationCard
    {
        return PublicationCard::from([
            'id' => $this->id,
            'number' => (string) $this->number,
            'title' => $this->title,
            'abstract' => $this->abstract,
            'attention' => $this->attention,
            'snippet' => $this->snippetFor($words),
            'foundIn' => 'report',
        ]);
    }

    public function dockCard(): DockCard
    {
        return DockCard::from([
            'type' => 'report',
            'number' => (string) $this->number,
            'title' => $this->title,
            'abstract' => $this->abstract,
            'route' => "/documents/reports/{$this->number}",
        ]);
    }

    public function view(): ReportView
    {
        return new ReportView(
            $this->id,
            (string) $this->number,
            $this->title,
            $this->abstract,
            $this->body,
            $this->creator_type->value,
            $this->creator_id,
            $this->attention,
            $this->filed_at->toIso8601String(),
        );
    }

    /**
     * The report's safe card for a share; a filed report never changes, so its published version is always 1.
     */
    public function shareCard(): ShareRecordCard
    {
        return new ShareRecordCard($this->shareIdentity(), $this->title, '1');
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
}
