<?php

declare(strict_types=1);

namespace Tests\Support\Runs;

use App\Contracts\Admission\ShellAdmission;
use App\Enums\Processes\ShellDialect;
use App\Models\Runs\PartRun;
use App\Models\Runs\ProcessRun;
use App\Values\ExecutionContext;
use App\Values\PartKey;
use Tests\Fixtures\Agents\TestStart;

/**
 * A shell line admitted as a test agent's run in the project folder, consumed by its runner with its first part
 * started, as the runner leaves it once it runs.
 */
trait AdmitsShellRuns
{
    private function runningRun(string $line = 'cat composer.json', string $key = 'key-1'): ProcessRun
    {
        config(['processes.runner' => true]);
        TestStart::start()->startRequest($this->app);
        $admission = $this->app->make(ShellAdmission::class)
            ->admit($line, ShellDialect::Bash, ExecutionContext::inFolder(base_path()), $key);
        $run = ProcessRun::query()->withoutGlobalScopes()->findOrFail($admission->runId);
        $run->consumeFor('test-key', (string) config('app.key'));
        PartRun::create($run, new PartKey(1, 1, 'cat'))->start('host', 1);

        return $run;
    }
}
