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
use Domain\Documents\Data\DockCard;
use Domain\Documents\Data\ReportCard;
use Domain\Documents\Data\ReportView;
use Domain\Documents\Enums\AttentionState;
use Domain\Documents\Exceptions\RecordImmutable;
use Domain\Documents\Models\Concerns\CreatedWithAttention;
use Domain\Documents\Models\Concerns\SearchesText;
use Domain\Documents\Models\Concerns\Settles;
use Domain\Documents\Support\MarkdownText;
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
 * @property string|null $origin_agent_id
 * @property string|null $origin_session_id
 * @property Carbon $filed_at
 * @property AttentionState $attention
 */
#[Fillable(['title', 'abstract', 'body', 'creator_type', 'creator_id', 'origin_agent_id', 'origin_session_id', 'filed_at'])]
final class Report extends Model implements Numbered, ReadableModel
{
    use BoundedReads, CreatedWithAttention, HasNumber, HasUlids, Linkable, SearchesText, Settles;

    public const string LINK_TYPE = 'documents.report';

    protected $attributes = ['attention' => 'active'];

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
            'title' => $title,
            'abstract' => $abstract,
            'body' => $body->text,
            'creator_type' => $author->actorType(),
            'creator_id' => $author->actorId(),
            'origin_agent_id' => $author->actorType() === ActorType::Agent ? $author->actorId() : null,
            'filed_at' => CarbonImmutable::now(),
        ]);
    }

    public function card(): ReportCard
    {
        return ReportCard::from(['id' => $this->id, 'number' => (string) $this->number, 'title' => $this->title, 'abstract' => $this->abstract, 'attention' => $this->attention]);
    }

    /**
     * The report as a search found it: its card with a snippet around the words.
     */
    public function hit(string $words): ReportCard
    {
        return ReportCard::from([
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
        return DockCard::from(['type' => 'report', 'number' => (string) $this->number, 'title' => $this->title, 'abstract' => $this->abstract, 'route' => "/documents/reports/{$this->number}"]);
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

    protected static function booted(): void
    {
        self::updating(function (self $report): void {
            if (array_diff(array_keys($report->getDirty()), ['attention', 'updated_at']) !== []) {
                throw RecordImmutable::for('report');
            }
        });
    }

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
