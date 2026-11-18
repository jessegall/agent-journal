<?php

declare(strict_types=1);

namespace Domain\Plans\Support;

use App\Actors\Contracts\CurrentActor;
use App\Assignments\Exceptions\RecordUnavailable;
use App\Assignments\Support\RecordIdentity;
use App\Reads\Support\ReadBuilder;
use App\Records\Contracts\RecordProvider;
use App\Records\Data\RecordCard;
use App\Records\Support\ProvidesModelRecords;
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
        return Phase::LINK_TYPE;
    }

    protected function readableRecords(): ReadBuilder
    {
        $this->actors->actor();

        return Phase::query()->with('plan');
    }

    protected function cardOf(Model $record): RecordCard
    {
        return RecordCard::from([
            'type' => Phase::LINK_TYPE,
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
