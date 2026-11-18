<?php

declare(strict_types=1);

namespace App\Processes\Admission;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Bus\Contracts\CommandBus;
use App\Processes\Commands\OpenCommandRequest;
use App\Processes\Contracts\CommandClassifier;
use App\Processes\Contracts\CommandPermissionReader;
use App\Processes\Contracts\ShellAdmission;
use App\Processes\Contracts\ShellSyntax;
use App\Processes\Contracts\VerificationTiming;
use App\Processes\Enums\OutputRequirement;
use App\Processes\Enums\ParseOutcome;
use App\Processes\Enums\RefusalCode;
use App\Processes\Enums\RequestHoldReason;
use App\Processes\Enums\RunMode;
use App\Processes\Enums\ShellDialect;
use App\Processes\Exceptions\ClassificationUnavailable;
use App\Processes\Exceptions\CommandRuleConflict;
use App\Processes\Models\CommandRequest;
use App\Processes\Models\ProcessRun;
use App\Processes\Models\RuleRevision;
use App\Processes\Support\ActiveRules;
use App\Processes\Support\ExecutionPlanner;
use App\Processes\Support\ProjectKey;
use App\Processes\Support\RunnerCapability;
use App\Processes\Values\Admission;
use App\Processes\Values\AdmissionRefusal;
use App\Processes\Values\AdmittedRun;
use App\Processes\Values\ClassFact;
use App\Processes\Values\Classification;
use App\Processes\Values\CommandPermissions;
use App\Processes\Values\ExecutionContext;
use App\Processes\Values\ExecutionPlan;
use App\Processes\Values\PartClassification;
use App\Processes\Values\ShellTree;
use Illuminate\Contracts\Container\Container;
use Throwable;

/**
 * The one admission of a shell line (doc 21 revision 6, sections 10 and 26): syntax, classification with the
 * project's active rules, output visibility, the actor's permissions, phase timing and the approved proven reader of
 * every test, check or build, then the runner. The whole line is admitted or refused at once; a refusal starts
 * nothing, and unknown work or a missing reader is held in a command request that names the next step. The classifier
 * is resolved per line, so a rule store that cannot be read refuses the line instead of failing the request.
 */
final readonly class LineAdmission implements ShellAdmission
{
    private const string EXPLAIN = 'Explain the line and propose its declaration.';

    public function __construct(
        private ShellSyntax $syntax,
        private Container $container,
        private OutputPolicy $outputs,
        private CommandPermissionReader $permissions,
        private VerificationTiming $timing,
        private ActiveRules $rules,
        private ExecutionPlanner $planner,
        private RunnerCapability $runner,
        private CurrentActor $actors,
        private CommandBus $commands,
        private ProjectKey $projects,
    ) {}

    public function admit(
        string $line,
        ShellDialect $dialect,
        ExecutionContext $context,
        string $requestKey,
    ): Admission {
        $actor = ActorIdentity::of($this->actors->actor());
        $tree = $this->syntax->parse($line, $dialect);
        $earlier = ProcessRun::query()->withoutGlobalScopes()->where('admission_id', $requestKey)->first();
        if ($earlier !== null) {
            return $this->repeated($earlier, $tree, $line, $context, $actor);
        }
        if ($tree->outcome !== ParseOutcome::Complete) {
            $reason = $tree->diagnostic === null ? 'The line could not be read completely.' : $tree->diagnostic->reason;

            return $this->refused(RefusalCode::ofSyntax($tree->outcome), $tree, $reason, 'Rewrite the line.');
        }
        try {
            $classification = $this->container->make(CommandClassifier::class)->classify($tree, $context);
            $refusal = $this->firstRefusal($tree, $classification, $context, $actor);
        } catch (ClassificationUnavailable $unavailable) {
            return $this->failed(RefusalCode::ClassificationUnavailable, $tree, $unavailable);
        } catch (CommandRuleConflict $conflict) {
            return $this->failed(RefusalCode::RuleConflict, $tree, $conflict);
        }
        if ($refusal !== null) {
            return Admission::refused($refusal);
        }

        return $this->admitted($tree, $classification, $context, $actor, $requestKey);
    }

    /**
     * The first reason any part of the line may not run, in the order the design checks them, or none.
     */
    private function firstRefusal(
        ShellTree $tree,
        Classification $classification,
        ExecutionContext $context,
        ActorIdentity $actor,
    ): AdmissionRefusal|null {
        foreach ($classification->parts as $part) {
            if (! $part->isKnown()) {
                $unknown = $this->unknown($tree, $part);

                return $this->held($unknown, $part, $tree, $context, RequestHoldReason::UnknownCommand);
            }
        }
        if (! $this->outputs->check($classification)->isAllowed()) {
            $correction = 'Run it unpiped and read its stored output.';

            return $this->refusal(RefusalCode::OutputHidden, $tree, 'Required output would be hidden.', $correction);
        }
        $permissions = $this->permissions->forActor($actor);
        foreach ($classification->parts as $part) {
            $refusal = $this->permissionRefusal($permissions, $tree, $classification, $part);
            if ($refusal !== null) {
                return $refusal;
            }
        }
        $timing = $classification->hasVerification() ? $this->timing->forCaller() : null;
        if ($timing !== null && ! $timing->isAllowed()) {
            $correction = 'Run it at the end of the phase.';

            return $this->refusal(RefusalCode::PhaseTiming, $tree, $timing->reason(), $correction);
        }
        foreach ($classification->parts as $part) {
            if ($part->outputRequirement() === OutputRequirement::Full && ! $this->hasApprovedReader($part)) {
                $reason = 'No proven reader is approved.';
                $refusal = $this->partRefusal(RefusalCode::ReaderRequired, $tree, $part, $reason);

                return $this->held($refusal, $part, $tree, $context, RequestHoldReason::ReaderRequired);
            }
        }
        if (! $this->runner->isOn()) {
            $correction = 'Use a host with its runner on.';

            return $this->refusal(RefusalCode::RunnerUnavailable, $tree, 'This host does not run lines.', $correction);
        }

        return null;
    }

    private function unknown(ShellTree $tree, PartClassification $part): AdmissionRefusal
    {
        if ($part->unresolved === []) {
            return $this->partRefusal(RefusalCode::CommandUnknown, $tree, $part, 'The part is not known.');
        }
        $first = $part->unresolved[0];

        return $this->partRefusal(RefusalCode::ofUnresolved($first->type), $tree, $part, $first->reason);
    }

    private function permissionRefusal(
        CommandPermissions $permissions,
        ShellTree $tree,
        Classification $classification,
        PartClassification $part,
    ): AdmissionRefusal|null {
        $argv = $classification->argvOf($part);
        if ($permissions->admits($part->classes(), $argv)) {
            return null;
        }
        $code = $permissions->deniedPatterns->matchesAny($argv) ? RefusalCode::CommandDenied : RefusalCode::ClassDenied;
        $classes = implode(', ', $part->classes()->toArray());

        $reason = "Your permissions do not admit {$classes}.";

        return $this->partRefusal($code, $tree, $part, $reason, 'Ask the project owner, or leave the part out.');
    }

    private function hasApprovedReader(PartClassification $part): bool
    {
        return $part->contracts !== [] && array_all(
            $part->contracts,
            fn ($contract): bool => array_any(
                $this->rules->approvedFor($contract->operation),
                fn (RuleRevision $revision): bool => $revision->reader_approvals !== [],
            ),
        );
    }

    /**
     * The refusal with the command request that holds the part's work, opened or reused, and its next step.
     */
    private function held(
        AdmissionRefusal $refusal,
        PartClassification $part,
        ShellTree $tree,
        ExecutionContext $context,
        RequestHoldReason $reason,
    ): AdmissionRefusal {
        $operation = $part->contracts === [] ? $part->program?->family ?? 'unknown' : $part->contracts[0]->operation;
        $digest = hash('sha256', $operation);
        $open = new OpenCommandRequest($operation, $digest, $tree->source, $context->workingFolder, $reason);
        $request = CommandRequest::query()->findOrFail($this->commands->run($open));

        return $refusal->heldIn($request->id, $request->nextStep()->command);
    }

    private function admitted(
        ShellTree $tree,
        Classification $classification,
        ExecutionContext $context,
        ActorIdentity $actor,
        string $requestKey,
    ): Admission {
        $plan = $this->planner->plan($tree, $classification);
        $policy = $this->permissions->forActor($actor);
        $references = array_map(fn (ClassFact $fact): string => $fact->origin->reference(), $classification->facts());
        $stored = ProcessRun::admit($actor, [
            'admission_id' => $requestKey,
            'mode' => RunMode::Normal,
            'project_key' => $this->projects->current(),
            'source_digest' => hash('sha256', $tree->source),
            'dialect' => $tree->dialect,
            'tree_digest' => $plan->treeDigest,
            'registry_revision' => $this->rules->registry()->revision(),
            'policy_revision' => "{$policy->source}@{$policy->revision}",
            'working_folder' => $context->workingFolder,
            'plan' => $plan->toArray(),
        ]);

        $run = $this->runOf($stored, $plan, $tree, $actor, array_values(array_unique($references)));

        return Admission::allowed($run, $stored->id);
    }

    /**
     * The same request key answers the admission it already made, unless the line differs or the run went stale.
     */
    private function repeated(
        ProcessRun $earlier,
        ShellTree $tree,
        string $line,
        ExecutionContext $context,
        ActorIdentity $actor,
    ): Admission {
        if (! hash_equals($earlier->source_digest, hash('sha256', $line))) {
            $reason = 'The key was used for another line.';

            return $this->refused(RefusalCode::RuleRevisionChanged, $tree, $reason, 'Use a new key.');
        }
        if ($earlier->isStale()) {
            return $this->refused(RefusalCode::RuleRevisionChanged, $tree, $earlier->stale_reason, 'Use a new key.');
        }

        $run = $this->runOf($earlier, ExecutionPlan::fromArray($earlier->plan), $tree, $actor, []);

        return Admission::allowed($run, $earlier->id);
    }

    /**
     * @param  list<string>  $references
     */
    private function runOf(
        ProcessRun $stored,
        ExecutionPlan $plan,
        ShellTree $tree,
        ActorIdentity $actor,
        array $references,
    ): AdmittedRun {
        return AdmittedRun::admitted(
            $stored->admission_id,
            $plan,
            $stored->source_digest,
            hash('sha256', $stored->working_folder),
            $stored->registry_revision,
            $stored->policy_revision,
            $references,
            $actor,
            '',
            $tree->source,
            $stored->working_folder,
        );
    }

    private function refusal(RefusalCode $code, ShellTree $tree, string $reason, string $correction): AdmissionRefusal
    {
        return AdmissionRefusal::of($code, $tree->root, $tree->source, $reason, $correction);
    }

    private function partRefusal(
        RefusalCode $code,
        ShellTree $tree,
        PartClassification $part,
        string $reason,
        string $correction = self::EXPLAIN,
    ): AdmissionRefusal {
        $source = $tree->textOf($tree->node($part->node)->range);

        return AdmissionRefusal::of($code, $part->node, $source, $reason, $correction);
    }

    private function refused(RefusalCode $code, ShellTree $tree, string $reason, string $correction): Admission
    {
        return Admission::refused($this->refusal($code, $tree, $reason, $correction));
    }

    private function failed(RefusalCode $code, ShellTree $tree, Throwable $failure): Admission
    {
        return $this->refused($code, $tree, $failure->getMessage(), 'Try again once the rules can be read.');
    }
}
