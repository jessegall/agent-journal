<?php

declare(strict_types=1);

namespace App\Support\Admission;

use App\Agents\Drivers\Capabilities\DriverCapabilities;
use App\Contracts\Admission\ShellAdmission;
use App\Contracts\Sessions\RuntimeResolver;
use App\Contracts\Sessions\SessionPolicyReader;
use App\Enums\CommandRules\AdmissionRefusalCode;
use App\Exceptions\StackTargetRefused;
use App\Support\Decisions\Decision;
use App\Support\Inputs\ShellCommandRequested;
use App\Support\Stack\AgentStack;
use App\Support\Stack\HookAnswer;
use App\Support\StackAccess;
use App\Values\AdmissionRefusal;
use App\Values\AgentText;
use App\Values\ExecutionContext;

/**
 * Core's mandatory admission of a shell line the frames let through: whatever a frame
 * answered, a line that would run is admitted first, the replacement when a state rewrote it. A refused line is denied
 * on the stack from before the walk; an admitted one reaches the agent as the supervised runner's line. A driver
 * that cannot take a rewrite, or a session with no runtime to run in, is refused, since the runner cannot reach it.
 * The hook id is the admission's request key, so a repeated delivery is answered by the replay and admits nothing new.
 * A session in a container of its own is judged by the same rules, and its allowed line runs in the container as
 * the frames answered: the container is only where the line runs, and no supervised runner reaches into it yet.
 */
final readonly class HookShellAdmission
{
    public function __construct(
        private ShellAdmission $admission,
        private RuntimeResolver $runtimes,
        private StackAccess $access,
        private SessionPolicyReader $policies,
    ) {}

    public function admit(
        ShellCommandRequested $input,
        HookAnswer $answer,
        AgentStack $stackBefore,
        DriverCapabilities $capabilities,
    ): HookAnswer {
        if ($answer->isDenied()) {
            return $answer;
        }

        $isContained = $this->runsInItsOwnContainer();

        if (! $isContained && ! $capabilities->rewrites->canRewrite()) {
            $limit = AgentText::of('core.shell.needs_approval');

            return $answer->replacedBy($this->runnerUnavailable($limit), $stackBefore);
        }

        try {
            $folder = $this->runtimes->folderOf($this->access->target()->sessionId);
        } catch (StackTargetRefused) {
            $limit = AgentText::of('core.shell.no_runtime');

            return $answer->replacedBy($this->runnerUnavailable($limit), $stackBefore);
        }

        if ($isContained) {
            return $this->judgedInContainer($input, $answer, $stackBefore, $folder);
        }

        return $this->admitted($input, $answer, $stackBefore, $folder);
    }

    /**
     * The same rules judge the line as anywhere: a refused line is denied on the stack from before the walk, and an
     * allowed one runs in the container as the frames answered, since no supervised runner reaches into it.
     */
    private function judgedInContainer(
        ShellCommandRequested $input,
        HookAnswer $answer,
        AgentStack $stackBefore,
        string $folder,
    ): HookAnswer {
        $dialect = $input->command->dialect;
        $line = $answer->isRewrite() ? $answer->decision->replacementLine() : $input->command->source;
        $refusal = $this->admission->judge($line, $dialect, new ExecutionContext($dialect, $folder, $folder));

        if ($refusal === null) {
            return $answer;
        }

        return $answer->replacedBy(Decision::deny($refusal->message()), $stackBefore);
    }

    private function runsInItsOwnContainer(): bool
    {
        $sessionId = $this->access->target()->sessionId;

        return $this->policies->isFrozenFor($sessionId)
            && $this->policies->policyFor($sessionId)->runsInOwnContainer();
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

    /**
     * The refusal of a line no runner can take here, with the limit that says why.
     */
    private function runnerUnavailable(AgentText $limit): Decision
    {
        return Decision::deny(AgentText::of('core.shell.runner_unavailable', [
            'code' => AdmissionRefusalCode::RunnerUnavailable->value,
            'limit' => $limit,
        ]));
    }
}
