<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Processes\Contracts\ShellAdmission;
use App\Processes\Enums\ShellDialect;
use App\Processes\Values\Admission;
use App\Processes\Values\ExecutionContext;

/**
 * A fixture admission that counts the lines it is asked to admit and hands each to Core's own admission.
 */
final class CountedAdmission implements ShellAdmission
{
    /**
     * @var list<string>
     */
    public array $lines = [];

    public function __construct(private readonly ShellAdmission $admission) {}

    public function admit(string $line, ShellDialect $dialect, ExecutionContext $context, string $requestKey): Admission
    {
        $this->lines[] = $line;

        return $this->admission->admit($line, $dialect, $context, $requestKey);
    }
}
