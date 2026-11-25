<?php

declare(strict_types=1);

namespace Tests\Support\Seeding;

use App\Contracts\Admission\ShellAdmission;
use App\Enums\Processes\ShellDialect;
use App\Models\Runs\PartRun;
use App\Models\Runs\ProcessRun;
use App\Values\ExecutionContext;
use App\Values\PartKey;
use Tests\Support\Seeding\Exceptions\FixtureRefused;

/**
 * Process runs kept under the names a test gives them: a shell line admitted for the actor in place in the project
 * folder, consumed by the runner, and its parts started on a host; they are not task runs.
 */
trait ArrangesProcessRuns
{
    /**
     * @var array<string, string> each run's id by its name
     */
    private array $processRunIds = [];

    /**
     * Admits the line for the acting agent under a request key of the run's name, and the runner takes the run.
     */
    public function processRun(string $name, string $line): self
    {
        if (array_key_exists($name, $this->processRunIds)) {
            throw FixtureRefused::occupiedAlias($name, ProcessRun::class);
        }

        config(['processes.runner' => true]);
        $admission = $this->app->make(ShellAdmission::class)
            ->admit($line, ShellDialect::Bash, ExecutionContext::inFolder(base_path()), "process-{$name}");
        $this->processRunIds[$name] = $admission->runId;
        $this->processRunCalled($name)->consumeFor("consume-{$name}", (string) config('app.key'));

        return $this;
    }

    /**
     * A part of the run started on the test host.
     */
    public function runningPart(string $name, PartKey $part): self
    {
        PartRun::create($this->processRunCalled($name), $part)->start('test host', 1);

        return $this;
    }

    public function processRunCalled(string $name): ProcessRun
    {
        $id = $this->processRunIds[$name] ?? throw FixtureRefused::missingAlias('process run', $name, self::OWNER);

        return ProcessRun::findForAnyActor($id);
    }

    /**
     * The newest attempt of the run's part at this syntax node.
     */
    public function partOf(string $name, int $node): PartRun
    {
        return PartRun::findLatestAttemptAt($this->processRunCalled($name), $node);
    }
}
