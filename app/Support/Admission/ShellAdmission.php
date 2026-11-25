<?php

declare(strict_types=1);

namespace App\Support\Admission;

use App\Commands\CommandRules\OpenCommandRequest\OpenCommandRequestCommand;
use App\Contracts\Actors\CurrentActor;
use App\Contracts\Admission\ShellAdmission as ShellAdmissionContract;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Bus\CommandClassifier;
use App\Contracts\Bus\CommandPermissionResolver;
use App\Contracts\Time\VerificationTiming;
use App\Enums\CommandRules\AdmissionRefusalCode;
use App\Enums\CommandRules\OutputRequirement;
use App\Enums\CommandRules\ParseOutcome;
use App\Enums\CommandRules\RequestHoldReason;
use App\Enums\Processes\ShellDialect;
use App\Enums\Runs\RunMode;
use App\Exceptions\ClassificationUnavailable;
use App\Exceptions\CommandRuleConflict;
use App\Exceptions\ExecutionPlanRefused;
use App\Models\CommandRules\CommandRequest;
use App\Models\CommandRules\RuleRevision;
use App\Models\Runs\ProcessRun;
use App\Support\ActiveRules;
use App\Support\ActorIdentity;
use App\Support\ExecutionPlanner;
use App\Support\OutputDiskCapacity;
use App\Support\RunnerCapability;
use App\Support\ServedEnvironment;
use App\Support\Syntax\TreeParser;
use App\Values\Admission;
use App\Values\AdmissionRefusal;
use App\Values\AdmittedRun;
use App\Values\AgentText;
use App\Values\ClassFact;
use App\Values\Classification;
use App\Values\CommandPermissions;
use App\Values\ExecutionContext;
use App\Values\ExecutionPlan;
use App\Values\PartClassification;
use App\Values\RunAdmission;
use App\Values\ShellTree;
use Illuminate\Contracts\Container\Container;

/**
 * The one admission of a shell line: syntax, classification with the
 * project's active rules, output visibility, the actor's permissions, phase timing and the approved proven reader of
 * every test, check or build, then the runner. The whole line is admitted or refused at once; a refusal starts
 * nothing, and unknown work or a missing reader is held in a command request that names the next step. The classifier
 * is resolved per line, so a rule store that cannot be read refuses the line instead of failing the request.
 */
final readonly class ShellAdmission implements ShellAdmissionContract
{
    public function __construct(
        private TreeParser $syntax,
        private Container $container,
        private OutputPolicy $outputs,
        private CommandPermissionResolver $permissions,
        private VerificationTiming $timing,
        private ActiveRules $rules,
        private ExecutionPlanner $planner,
        private RunnerCapability $runner,
        private CurrentActor $actors,
        private CommandBus $commands,
        private ServedEnvironment $projects,
        private OutputDiskCapacity $capacity,
    ) {}

    public function admit(
        string $line,
        ShellDialect $dialect,
        ExecutionContext $context,
        string $requestKey,
    ): Admission {
        $this->projects->assertFolderAllowed($context->workingFolder);
        $actor = ActorIdentity::of($this->actors->actor());
        $tree = $this->syntax->parse($line, $dialect);
        $earlier = ProcessRun::query()->acrossActors()->ofAdmission($requestKey)->first();

        if ($earlier !== null) {
            return $this->repeated($earlier, $tree, $line, $actor);
        }

        if ($tree->outcome !== ParseOutcome::Complete) {
            $reason = $tree->diagnostic === null ? AgentText::of('core.shell.unreadable') : $tree->diagnostic->reason;
            $rewrite = AgentText::of('core.shell.rewrite');

            return $this->refused(AdmissionRefusalCode::ofSyntax($tree->outcome), $tree, $reason, $rewrite);
        }

        try {
            // Made here, inside the try: making the classifier reads the project rules, and an unreadable rule store
            // refuses the line instead of failing the admission itself.
            $classification = $this->container->make(CommandClassifier::class)->classify($tree, $context);
            $refusal = $this->firstRefusal($tree, $classification, $context, $actor);
        } catch (ClassificationUnavailable $unavailable) {
            return $this->failed(AdmissionRefusalCode::ClassificationUnavailable, $tree, $unavailable);
        } catch (CommandRuleConflict $conflict) {
            return $this->failed(AdmissionRefusalCode::RuleConflict, $tree, $conflict);
        }

        if ($refusal !== null) {
            return Admission::refused($refusal);
        }

        try {
            return $this->admitted($tree, $classification, $context, $actor, $requestKey);
        } catch (ExecutionPlanRefused $refused) {
            $correction = AgentText::of('core.shell.dynamic_words');

            return $this->refused(AdmissionRefusalCode::SyntaxUnsupported, $tree, $refused->reason, $correction);
        }
    }

    public function judge(string $line, ShellDialect $dialect, ExecutionContext $context): AdmissionRefusal|null
    {
        $this->projects->assertFolderAllowed($context->workingFolder);
        $tree = $this->syntax->parse($line, $dialect);

        if ($tree->outcome !== ParseOutcome::Complete) {
            $reason = $tree->diagnostic === null ? AgentText::of('core.shell.unreadable') : $tree->diagnostic->reason;
            $rewrite = AgentText::of('core.shell.rewrite');

            return $this->refusal(AdmissionRefusalCode::ofSyntax($tree->outcome), $tree, $reason, $rewrite);
        }

        try {
            $classification = $this->container->make(CommandClassifier::class)->classify($tree, $context);
        } catch (ClassificationUnavailable $unavailable) {
            return $this->unreadable(AdmissionRefusalCode::ClassificationUnavailable, $tree, $unavailable);
        } catch (CommandRuleConflict $conflict) {
            return $this->unreadable(AdmissionRefusalCode::RuleConflict, $tree, $conflict);
        }

        $refusal = $this->unknownRefusal($tree, $classification, $context)
            ?? $this->deniedOrMistimed($tree, $classification, ActorIdentity::of($this->actors->actor()));

        if ($refusal !== null) {
            return $refusal;
        }

        foreach ($classification->parts as $part) {
            if ($part->outputRequirement() === OutputRequirement::Full) {
                $code = AdmissionRefusalCode::RunnerUnavailable;
                $reason = AgentText::of('core.shell.needs_runner_output');

                return $this->partRefusal($code, $tree, $part, $reason, AgentText::of('core.shell.run_on_runner'));
            }
        }

        return null;
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
        $unknown = $this->unknownRefusal($tree, $classification, $context);

        if ($unknown !== null) {
            return $unknown;
        }

        if (! $this->outputs->check($classification)->isAllowed()) {
            return $this->refusal(
                AdmissionRefusalCode::OutputHidden,
                $tree,
                AgentText::of('core.shell.output_hidden'),
                AgentText::of('core.shell.run_unpiped'),
            );
        }

        $denied = $this->deniedOrMistimed($tree, $classification, $actor);

        if ($denied !== null) {
            return $denied;
        }

        foreach ($classification->parts as $part) {
            if ($part->outputRequirement() === OutputRequirement::Full && ! $this->hasApprovedReader($part)) {
                $reason = AgentText::of('core.shell.no_reader');
                $code = AdmissionRefusalCode::ReaderRequired;
                $refusal = $this->partRefusal($code, $tree, $part, $reason, $this->explain());

                return $this->held($refusal, $part, $tree, $context, RequestHoldReason::ReaderRequired);
            }
        }

        if (! $this->capacity->hasRoom()) {
            return $this->refusal(
                AdmissionRefusalCode::RunnerUnavailable,
                $tree,
                AgentText::of('core.shell.disk_full'),
                AgentText::of('core.shell.free_disk'),
            );
        }

        if (! $this->runner->isOn()) {
            return $this->refusal(
                AdmissionRefusalCode::RunnerUnavailable,
                $tree,
                AgentText::of('core.shell.host_runs_nothing'),
                AgentText::of('core.shell.use_runner_host'),
            );
        }

        return null;
    }

    /**
     * The refusal of the first part no rule knows, held in a command request, or none.
     */
    private function unknownRefusal(
        ShellTree $tree,
        Classification $classification,
        ExecutionContext $context,
    ): AdmissionRefusal|null {
        foreach ($classification->parts as $part) {
            if (! $part->isKnown()) {
                $unknown = $this->unknown($tree, $part);

                return $this->held($unknown, $part, $tree, $context, RequestHoldReason::UnknownCommand);
            }
        }

        return null;
    }

    /**
     * The refusal of the first part the actor's permissions do not admit, or of a verification outside its phase's
     * time, or none.
     */
    private function deniedOrMistimed(
        ShellTree $tree,
        Classification $classification,
        ActorIdentity $actor,
    ): AdmissionRefusal|null {
        $permissions = $this->permissions->forActor($actor);

        foreach ($classification->parts as $part) {
            $refusal = $this->permissionRefusal($permissions, $tree, $classification, $part);

            if ($refusal !== null) {
                return $refusal;
            }
        }

        $timing = $classification->hasVerification() ? $this->timing->forCaller() : null;

        if ($timing !== null && ! $timing->isAllowed()) {
            $correction = AgentText::of('core.shell.run_at_phase_end');

            return $this->refusal(AdmissionRefusalCode::PhaseTiming, $tree, $timing->reason(), $correction);
        }

        return null;
    }

    private function unknown(ShellTree $tree, PartClassification $part): AdmissionRefusal
    {
        if ($part->unresolved === []) {
            $reason = AgentText::of('core.shell.part_unknown');

            return $this->partRefusal(AdmissionRefusalCode::CommandUnknown, $tree, $part, $reason, $this->explain());
        }

        $first = $part->unresolved[0];

        $code = AdmissionRefusalCode::ofUnresolved($first->type);

        return $this->partRefusal($code, $tree, $part, $first->reason, $this->explain());
    }

    private function permissionRefusal(
        CommandPermissions $permissions,
        ShellTree $tree,
        Classification $classification,
        PartClassification $part,
    ): AdmissionRefusal|null {
        $argv = $classification->argvOf($part);
        $classes = $classification->classesOf($part);

        if ($permissions->admits($classes, $argv)) {
            return null;
        }

        $code = $permissions->deniedPatterns->matchesAny($argv)
            ? AdmissionRefusalCode::CommandDenied
            : AdmissionRefusalCode::ClassDenied;

        $classes = implode(', ', $classes->values());

        $reason = AgentText::of('core.shell.not_permitted', ['classes' => $classes]);

        return $this->partRefusal($code, $tree, $part, $reason, AgentText::of('core.shell.ask_owner'));
    }

    private function hasApprovedReader(PartClassification $part): bool
    {
        return $part->contracts !== [] && array_all(
            $part->contracts,
            fn ($contract) => array_any(
                $this->rules->approvedFor($contract->operation),
                fn (RuleRevision $revision) => $revision->reader_approvals->count() > 0,
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
        $operation = $part->contracts === [] ? $part->program->family ?? 'unknown' : $part->contracts[0]->operation;
        $digest = hash('sha256', $operation);
        $open = new OpenCommandRequestCommand($operation, $digest, $tree->source, $context->workingFolder, $reason);
        $request = CommandRequest::query()->findOrFail($this->commands->run($open));

        return $refusal->heldIn($request->id, $request->nextStep->command);
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
        $references = array_map(fn (ClassFact $fact) => $fact->origin->reference(), $classification->facts());

        $stored = ProcessRun::create($actor, new RunAdmission(
            $requestKey,
            RunMode::Normal,
            $this->projects->current(),
            hash('sha256', $tree->source),
            $tree->dialect,
            $this->rules->registry()->revision(),
            "{$policy->source}@{$policy->revision}",
            $context->workingFolder,
            $plan,
        ));

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
        ActorIdentity $actor,
    ): Admission {
        if (! hash_equals($earlier->source_digest, hash('sha256', $line))) {
            $reason = AgentText::of('core.shell.key_reused');

            return $this->refused(AdmissionRefusalCode::RuleRevisionChanged, $tree, $reason, $this->newKey());
        }

        if ($earlier->isStale()) {
            return $this->refused(
                AdmissionRefusalCode::RuleRevisionChanged,
                $tree,
                AgentText::of('core.shell.run_stale', ['reason' => $earlier->stale_reason]),
                $this->newKey(),
            );
        }

        $run = $this->runOf($earlier, $earlier->plan, $tree, $actor, []);

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

    private function refusal(
        AdmissionRefusalCode $code,
        ShellTree $tree,
        AgentText $reason,
        AgentText $correction,
    ): AdmissionRefusal {
        return AdmissionRefusal::of($code, $tree->root, $tree->source, $reason, $correction);
    }

    private function partRefusal(
        AdmissionRefusalCode $code,
        ShellTree $tree,
        PartClassification $part,
        AgentText $reason,
        AgentText $correction,
    ): AdmissionRefusal {
        $source = $tree->textOf($part->nodeIn($tree)->range);

        return AdmissionRefusal::of($code, $part->node, $source, $reason, $correction);
    }

    private function refused(
        AdmissionRefusalCode $code,
        ShellTree $tree,
        AgentText $reason,
        AgentText $correction,
    ): Admission {
        return Admission::refused($this->refusal($code, $tree, $reason, $correction));
    }

    private function failed(
        AdmissionRefusalCode $code,
        ShellTree $tree,
        ClassificationUnavailable|CommandRuleConflict $failure,
    ): Admission {
        return Admission::refused($this->unreadable($code, $tree, $failure));
    }

    private function unreadable(
        AdmissionRefusalCode $code,
        ShellTree $tree,
        ClassificationUnavailable|CommandRuleConflict $failure,
    ): AdmissionRefusal {
        return $this->refusal($code, $tree, $failure->reason, AgentText::of('core.shell.retry_when_readable'));
    }

    private function newKey(): AgentText
    {
        return AgentText::of('core.shell.new_key');
    }

    private function explain(): AgentText
    {
        return AgentText::of('core.shell.explain');
    }
}
