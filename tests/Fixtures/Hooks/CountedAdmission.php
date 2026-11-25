<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Contracts\Admission\ShellAdmission;
use App\Enums\Processes\ShellDialect;
use App\Values\Admission;
use App\Values\AdmissionRefusal;
use App\Values\ExecutionContext;

/**
 * A fixture admission that counts the lines it is asked to admit or to judge and hands each to Core's own admission.
 */
final class CountedAdmission implements ShellAdmission
{
    /**
     * @var list<string>
     */
    public array $lines = [];

    /**
     * @var list<string>
     */
    public array $judged = [];

    public function __construct(private readonly ShellAdmission $admission) {}

    public function admit(string $line, ShellDialect $dialect, ExecutionContext $context, string $requestKey): Admission
    {
        $this->lines[] = $line;

        return $this->admission->admit($line, $dialect, $context, $requestKey);
    }

    public function judge(string $line, ShellDialect $dialect, ExecutionContext $context): AdmissionRefusal|null
    {
        $this->judged[] = $line;

        return $this->admission->judge($line, $dialect, $context);
    }
}
