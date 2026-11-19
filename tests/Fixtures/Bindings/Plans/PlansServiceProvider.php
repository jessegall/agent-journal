<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bindings\Plans;

use App\Processes\Contracts\ShellCommandParser;
use Illuminate\Support\ServiceProvider;
use Tests\Fixtures\Bindings\Plans\Contracts\PlanCounter;
use Tests\Fixtures\Bindings\Plans\Contracts\PlanResolver;
use Tests\Fixtures\Bindings\Tasks\Contracts\TaskResolver;
use Tests\Fixtures\Bindings\Tasks\TaskList;

final class PlansServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(PlanResolver::class, PlanNotes::class);
        $this->app->bind(TaskResolver::class, PlanParser::class);
        $this->app->bind(PlanCounter::class, TaskList::class);
        $this->app->singleton(ShellCommandParser::class, PlanParser::class);
    }
}
