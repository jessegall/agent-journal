<?php

declare(strict_types=1);

namespace Tests\Fixtures\Processes;

use App\Actors\Support\ActorIdentity;
use App\Processes\Contracts\CommandClassifier;
use App\Processes\Contracts\ShellSyntax;
use App\Processes\Enums\ShellDialect;
use App\Processes\Support\ExecutionPlanner;
use App\Processes\Values\AdmittedRun;
use App\Processes\Values\ExecutionContext;

/**
 * Admits command lines for tests until the admission service exists: only a fully known line gets an admitted run.
 */
final readonly class TestAdmissions
{
    public function __construct(private ShellSyntax $syntax, private CommandClassifier $classifier, private ExecutionPlanner $planner) {}

    public function admit(string $line, string $folder, ActorIdentity $actor): AdmittedRun
    {
        $tree = $this->syntax->parse($line, ShellDialect::Bash);
        $plan = $this->planner->plan($tree, $this->classifier->classify($tree, new ExecutionContext(ShellDialect::Bash, $folder, $folder)));

        return AdmittedRun::admitted(bin2hex(random_bytes(8)), $plan, hash('sha256', $line), hash('sha256', $folder), 'rules-1', 'policy-1', [], $actor, '', $line, $folder);
    }
}
