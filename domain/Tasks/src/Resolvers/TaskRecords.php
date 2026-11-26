<?php

declare(strict_types=1);

namespace Domain\Tasks\Resolvers;

use App\Actors\Contracts\CurrentActor;
use App\Data\Pages\RecordCard;
use App\Links\Concerns\ProvidesModelRecords;
use App\Records\Contracts\RecordProvider;
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
        return Task::linkType();
    }

    protected function readableRecords(): ReadBuilder
    {
        $this->actors->actor();

        return Task::query();
    }

    protected function cardOf(Model $record): RecordCard
    {
        return RecordCard::from([
            'type' => Task::linkType(),
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
