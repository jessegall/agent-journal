<?php

declare(strict_types=1);

namespace Domain\Documents\Support\Links;

use App\Actors\Contracts\CurrentActor;
use App\Data\Pages\RecordCard;
use App\Links\Concerns\ProvidesModelRecords;
use App\Records\Contracts\RecordProvider;
use App\Support\ReadBuilder;
use Domain\Documents\Models\Report;
use Domain\Documents\Support\RecordChanges;
use Illuminate\Container\Attributes\Scoped;
use Illuminate\Database\Eloquent\Model;

/**
 * Reports as linkable records: published to every signed-in actor, and changed by a user or the agent that
 * created them, the same authority as settling.
 */
#[Scoped]
final readonly class ReportLinkRecords implements RecordProvider
{
    /**
     * @use ProvidesModelRecords<Report>
     */
    use ProvidesModelRecords;

    public function __construct(private RecordChanges $changes, private CurrentActor $actors) {}

    public function referenceWord(): string
    {
        return 'report';
    }

    protected function linkType(): string
    {
        return Report::linkType();
    }

    protected function readableRecords(): ReadBuilder
    {
        $this->actors->actor();

        return Report::query()->sharedPublished();
    }

    protected function cardOf(Model $record): RecordCard
    {
        return $this->numberedCard(
            $record,
            "report {$record->number}",
            $record->title,
            "/documents/reports/{$record->number}",
            $record->abstract,
        );
    }

    protected function mayChange(Model $record): bool
    {
        return $this->changes->mayChange($record);
    }
}
