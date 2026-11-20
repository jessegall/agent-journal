<?php

declare(strict_types=1);

namespace App\Hooks\Stack;

use App\Agents\Contracts\RuntimeResolver;
use App\Agents\Exceptions\StackTargetRefused;
use App\Hooks\Decisions\Decision;
use App\Hooks\Inputs\ShellCommandRequested;
use App\Hooks\Programs\ProgramCapabilities;
use App\Hooks\Support\StackAccess;
use App\Processes\Contracts\ShellAdmission;
use App\Processes\Enums\AdmissionRefusalCode;
use App\Processes\Values\AdmissionRefusal;
use App\Processes\Values\ExecutionContext;

/**
 * Core's mandatory admission of a shell line the frames let through (doc 21 revision 6, section 10): whatever a frame
 * answered, a line that would run is admitted first, the replacement when a state rewrote it. A refused line is denied
 * on the stack from before the walk; an admitted one reaches the agent as the supervised runner's line. A program
 * that cannot take a rewrite, or a session with no runtime to run in, is refused, since the runner cannot reach it.
 * The hook id is the admission's request key, so a repeated delivery is answered by the replay and admits nothing new.
 */
final readonly class HookShellAdmission
{
    private const string RUNNER_UNAVAILABLE = "The journal's supervised runner cannot run this line, so nothing started.";

    public function __construct(
        private ShellAdmission $admission,
        private RuntimeResolver $runtimes,
        private StackAccess $access,
    ) {}

    public function admit(
        ShellCommandRequested $input,
        HookAnswer $answer,
        AgentStack $stackBefore,
        ProgramCapabilities $capabilities,
    ): HookAnswer {
        if ($answer->isDenied()) {
            return $answer;
        }

        if (! $capabilities->rewrites->canRewrite()) {
            $limit = 'This program cannot take a rewritten command line without asking first.';

            return $answer->replacedBy($this->runnerUnavailable($limit), $stackBefore);
        }

        try {
            $folder = $this->runtimes->folderOf($this->access->target()->sessionId);
        } catch (StackTargetRefused) {
            $limit = 'This session has no runtime to run it in.';

            return $answer->replacedBy($this->runnerUnavailable($limit), $stackBefore);
        }

        return $this->admitted($input, $answer, $stackBefore, $folder);
    }

    private function admitted(
        ShellCommandRequested $input,
        HookAnswer $answer,
        AgentStack $stackBefore,
        string $folder,
    ): HookAnswer {
        $dialect = $input->command->dialect;
        $line = $answer->isRewrite() ? $answer->decision->replacementLine() : $input->command->source;
        $context = new ExecutionContext($dialect, $folder, $folder);
        $admission = $this->admission->admit($line, $dialect, $context, $input->hook->hookId);
        $refusal = $admission->decision;

        if ($refusal instanceof AdmissionRefusal) {
            return $answer->replacedBy(Decision::deny($refusal->message()), $stackBefore);
        }
        $runnerLine = "journal process run --admission {$admission->runId}";

        return $answer->replacedBy(Decision::rewrite($runnerLine), $answer->stack);
    }

    private function runnerUnavailable(string $limit): Decision
    {
        return Decision::deny(AdmissionRefusalCode::RunnerUnavailable->value.': '.self::RUNNER_UNAVAILABLE.' '.$limit);
    }
}
