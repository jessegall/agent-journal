<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bindings\Plans;

use App\Core\Hooks\Contracts\ShellCommandParser;
use Illuminate\Support\ServiceProvider;
use Tests\Fixtures\Bindings\Plans\Contracts\PlanCounter;
use Tests\Fixtures\Bindings\Tasks\Contracts\TaskReader;
use Tests\Fixtures\Bindings\Tasks\TaskList;

final class PlansServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(TaskReader::class, PlanParser::class);
        $this->app->bind(PlanCounter::class, TaskList::class);
        $this->app->singleton(ShellCommandParser::class, PlanParser::class);
    }
}
