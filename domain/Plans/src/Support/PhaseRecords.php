<?php

declare(strict_types=1);

namespace Domain\Plans\Support;

use App\Actors\Contracts\CurrentActor;
use App\Data\Pages\RecordCard;
use App\Exceptions\RecordUnavailable;
use App\Links\Concerns\ProvidesModelRecords;
use App\Records\Contracts\RecordProvider;
use App\Support\ReadBuilder;
use App\Support\RecordIdentity;
use Domain\Plans\Models\Phase;
use Illuminate\Container\Attributes\Scoped;
use Illuminate\Database\Eloquent\Model;

/**
 * Phases as linkable records, read and changed by every signed-in actor like their plans. A phase is numbered
 * within its plan, so a bare phase number names no phase; it is linked from its plan's pages by id.
 */
#[Scoped]
final readonly class PhaseRecords implements RecordProvider
{
    /**
     * @use ProvidesModelRecords<Phase>
     */
    use ProvidesModelRecords;

    public function __construct(private CurrentActor $actors) {}

    public function referenceWord(): string
    {
        return 'phase';
    }

    public function identityOf(int $number): RecordIdentity
    {
        throw RecordUnavailable::numbered('phase', $number);
    }

    protected function linkType(): string
    {
        return Phase::linkType();
    }

    protected function readableRecords(): ReadBuilder
    {
        $this->actors->actor();

        return Phase::query()->withPlan();
    }

    protected function cardOf(Model $record): RecordCard
    {
        return RecordCard::from([
            'type' => Phase::linkType(),
            'id' => $record->id,
            'number' => (string) $record->number,
            'label' => "plan {$record->plan->number}, phase {$record->number}",
            'title' => $record->title,
            'abstract' => null,
            'route' => "/plans/{$record->plan->number}/phases/{$record->number}",
        ]);
    }

    protected function mayChange(Model $record): bool
    {
        return true;
    }
}
