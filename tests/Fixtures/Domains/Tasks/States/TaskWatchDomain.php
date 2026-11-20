<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Tasks\States;

use App\Actors\Contracts\PolicyProvider;
use App\Actors\Values\PolicyRegistration;
use App\Bus\Contracts\CommandProvider;
use App\Domains\Concerns\HasStates;
use App\Domains\Contracts\StateProvider;
use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use Domain\Tasks\TasksDomain;
use Tests\Fixtures\Bus\Models\FixtureWork;
use Tests\Fixtures\Domains\Tasks\States\Commands\RecordCancelledTask;
use Tests\Fixtures\Domains\Tasks\States\Commands\RecordFinishedTask;
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
            'states.task_watch' => TaskWatchLoader::class,
            'states.ordinary_task_watch' => OrdinaryTaskWatchLoader::class,
        ];
    }

    public function commands(): array
    {
        return [RecordFinishedTask::class, RecordCancelledTask::class];
    }

    public function policies(): array
    {
        return [new PolicyRegistration(FixtureWork::class, TaskWatchPolicy::class, TaskWatchAbility::class)];
    }
}
