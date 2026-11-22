<?php

declare(strict_types=1);

namespace Domain\Tasks\Resolvers;

use App\Concerns\ProvidesModelRecords;
use App\Contracts\CurrentActor;
use App\Contracts\RecordProvider;
use App\Data\RecordCard;
use App\Support\ReadBuilder;
use Domain\Tasks\Models\Task;
use Illuminate\Container\Attributes\Scoped;
use Illuminate\Database\Eloquent\Model;

/**
 * Tasks as linkable records: every signed-in actor reads and changes every task, as Tasks' own commands allow.
 */
#[Scoped]
final readonly class TaskRecords implements RecordProvider
{
    /**
     * @use ProvidesModelRecords<Task>
     */
    use ProvidesModelRecords;

    public function __construct(private CurrentActor $actors) {}

    public function referenceWord(): string
    {
        return 'task';
    }

    protected function linkType(): string
    {
        return Task::LINK_TYPE;
    }

    protected function readableRecords(): ReadBuilder
    {
        $this->actors->actor();

        return Task::query();
    }

    protected function cardOf(Model $record): RecordCard
    {
        return RecordCard::from([
            'type' => Task::LINK_TYPE,
            'id' => $record->id,
            'number' => (string) $record->number,
            'label' => "task {$record->number}",
            'title' => $record->title,
            'abstract' => null,
            'route' => "/tasks/{$record->number}",
        ]);
    }

    protected function mayChange(Model $record): bool
    {
        return true;
    }
}
