<?php

declare(strict_types=1);

namespace Tests\Support\Seeding;

use App\Access\Contracts\ShellAdmission;
use App\Models\Runs\PartRun;
use App\Models\Runs\ProcessRun;
use App\Processes\Enums\ShellDialect;
use App\Processes\Values\PartKey;
use App\Values\ExecutionContext;
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

    /**
     * The run the naming verb admits and the runner takes, given back at once instead of read back by its name.
     */
    public function createProcessRun(string $name, string $line): ProcessRun
    {
        return $this->processRun($name, $line)->processRunCalled($name);
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
