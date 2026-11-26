<?php

declare(strict_types=1);

namespace App\Access\Values;

use App\Processes\Enums\RunMode;
use App\Support\ActorReference;
use App\Values\ExecutionPlan;

/**
 * A command line admitted to run: its single-use admission id, mode, line, folder and plan, the digests, revisions and
 * bindings it was admitted under, and its actor. Only the named factories make one, and the runner checks it again at
 * start.
 */
final readonly class AdmittedRun
{
    /**
     * @param  list<string>  $bindings  the rule, contract and script references the admission relied on
     */
    private function __construct(
        public string $admissionId,
        public RunMode $mode,
        public ExecutionPlan $plan,
        public string $sourceDigest,
        public string $contextDigest,
        public string $registryRevision,
        public string $policyRevision,
        public array $bindings,
        public ActorReference $actor,
        public string $eventKey,
        public string $source,
        public string $workingFolder,
    ) {}

    /**
     * A run the admission service let through after its checks; its result may answer the agent.
     *
     * @param  list<string>  $bindings
     */
    public static function admitted(
        string $admissionId,
        ExecutionPlan $plan,
        string $sourceDigest,
        string $contextDigest,
        string $registryRevision,
        string $policyRevision,
        array $bindings,
        ActorReference $actor,
        string $eventKey,
        string $source,
        string $workingFolder,
    ): self {
        return new self(
            $admissionId,
            RunMode::Normal,
            $plan,
            $sourceDigest,
            $contextDigest,
            $registryRevision,
            $policyRevision,
            $bindings,
            $actor,
            $eventKey,
            $source,
            $workingFolder,
        );
    }

    /**
     * A run an evidence permit allows, to prove a reader or contract; it never answers the agent.
     *
     * @param  list<string>  $bindings
     */
    public static function forEvidence(
        string $admissionId,
        ExecutionPlan $plan,
        string $sourceDigest,
        string $contextDigest,
        string $registryRevision,
        string $policyRevision,
        array $bindings,
        ActorReference $actor,
        string $eventKey,
        string $source,
        string $workingFolder,
    ): self {
        return new self(
            $admissionId,
            RunMode::Evidence,
            $plan,
            $sourceDigest,
            $contextDigest,
            $registryRevision,
            $policyRevision,
            $bindings,
            $actor,
            $eventKey,
            $source,
            $workingFolder,
        );
    }
}
