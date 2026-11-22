<?php

declare(strict_types=1);

namespace Domain\Plans\Support;

use App\Concerns\ProvidesModelRecords;
use App\Contracts\CurrentActor;
use App\Contracts\RecordProvider;
use App\Data\RecordCard;
use App\Support\ReadBuilder;
use Domain\Plans\Models\Plan;
use Illuminate\Container\Attributes\Scoped;
use Illuminate\Database\Eloquent\Model;

/**
 * Plans as linkable records: every signed-in actor reads and changes every plan, as Plans' own commands allow.
 */
#[Scoped]
final readonly class PlanRecords implements RecordProvider
{
    /**
     * @use ProvidesModelRecords<Plan>
     */
    use ProvidesModelRecords;

    public function __construct(private CurrentActor $actors) {}

    public function referenceWord(): string
    {
        return 'plan';
    }

    protected function linkType(): string
    {
        return Plan::LINK_TYPE;
    }

    protected function readableRecords(): ReadBuilder
    {
        $this->actors->actor();

        return Plan::query();
    }

    protected function cardOf(Model $record): RecordCard
    {
        return RecordCard::from([
            'type' => Plan::LINK_TYPE,
            'id' => $record->id,
            'number' => (string) $record->number,
            'label' => "plan {$record->number}",
            'title' => $record->title,
            'abstract' => null,
            'route' => "/plans/{$record->number}",
        ]);
    }

    protected function mayChange(Model $record): bool
    {
        return true;
    }
}
