<?php

declare(strict_types=1);

namespace Domain\Documents\Support\Links;

use App\Concerns\ProvidesModelRecords;
use App\Contracts\CurrentActor;
use App\Contracts\RecordProvider;
use App\Data\RecordCard;
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
        return Report::LINK_TYPE;
    }

    protected function readableRecords(): ReadBuilder
    {
        $this->actors->actor();

        return Report::query()->sharedPublished();
    }

    protected function cardOf(Model $record): RecordCard
    {
        return RecordCard::from([
            'type' => Report::LINK_TYPE,
            'id' => $record->id,
            'number' => (string) $record->number,
            'label' => "report {$record->number}",
            'title' => $record->title,
            'abstract' => $record->abstract,
            'route' => "/documents/reports/{$record->number}",
        ]);
    }

    protected function mayChange(Model $record): bool
    {
        return $this->changes->mayChange($record);
    }
}
