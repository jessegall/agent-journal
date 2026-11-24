<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Tasks\States;

use App\Enums\AccessType;
use App\Contracts\Authorization\PolicyProvider;
use App\Values\PolicyDefinition;
use App\Contracts\Bus\CommandProvider;
use App\Concerns\HasStates;
use App\Contracts\Records\StateProvider;
use App\Support\Domain;
use App\Support\Exports;
use Domain\Tasks\TasksDomain;
use Tests\Fixtures\Bus\Models\FixtureWork;
use Tests\Fixtures\Domains\Tasks\States\Commands\RecordTaskCancelled\RecordTaskCancelledCommand;
use Tests\Fixtures\Domains\Tasks\States\Commands\RecordTaskFinished\RecordTaskFinishedCommand;
use Tests\Fixtures\Domains\Tasks\States\Policies\TaskWatchPolicy;

final class TaskWatchDomain extends Domain implements CommandProvider, PolicyProvider, StateProvider
{
    use HasStates;

    public function description(): string
    {
        return 'A fixture module listening to exported Tasks events on live frames.';
    }

    public function requires(): array
    {
        return [TasksDomain::class];
    }

    public function exports(): Exports
    {
        return Exports::make()->build();
    }

    public function states(): array
    {
        return [
            TaskWatchState::class,
            OrdinaryTaskWatchState::class,
        ];
    }

    public function commands(): array
    {
        return [RecordTaskFinishedCommand::class, RecordTaskCancelledCommand::class];
    }

    public function policies(): array
    {
        return [new PolicyDefinition(TaskWatchPolicy::class, [AccessType::Read, AccessType::Create, AccessType::Edit, AccessType::Delete])];
    }
}
