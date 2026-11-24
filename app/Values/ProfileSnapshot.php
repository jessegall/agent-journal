<?php

declare(strict_types=1);

namespace App\Values;

use App\Attributes\Authorize;
use App\Contracts\Authorization\Policy;
use App\Contracts\Bus\Command;
use App\Enums\AccessType;
use App\Enums\InstancePolicy;
use App\Enums\ModelTier;
use Spatie\LaravelData\Data;

/**
 * One immutable revision of a profile as a start reads it: its type, instructions, default model, skill lists and
 * start policy. A null skill allowlist means every applicable skill; an empty one means none.
 */
final class ProfileSnapshot extends Data
{
    /**
     * @param  list<string>|null  $skillAllowlist
     * @param  list<string>  $requiredSkills
     */
    public function __construct(
        public readonly ProfileKey $key,
        public readonly int $revision,
        public readonly ProfileBase $base,
        public readonly string $instructions,
        public readonly ModelTier $preferredTier,
        public readonly array|null $skillAllowlist,
        public readonly array $requiredSkills,
        public readonly ProfileStartPolicy $start,
        public readonly ProfileAuthorization $authorization,
        public readonly SupervisorRoutes $supervisor = new SupervisorRoutes(),
        public readonly InstancePolicy $instances = InstancePolicy::Reusable,
    ) {}

    /**
     * Where the profile's own routes send an ask of this type.
     */
    public function supervisorTargetFor(AskTypeKey $type): SupervisorTarget
    {
        return $this->supervisor->targetFor($type);
    }

    /**
     * What this revision lets a start run, from its access declaration.
     */
    public function processGrants(): ProcessGrants
    {
        return $this->start->access->processes;
    }

    public function allowsOperation(Operation $operation): bool
    {
        return $this->start->allowsOperation($operation);
    }

    /**
     * Whether the profile admits this application command.
     *
     * @param  class-string<Command<mixed>>  $command
     */
    public function admits(string $command, Authorize $authorize): AccessDecision
    {
        return $this->authorization->admits($command, $authorize);
    }

    /**
     * Whether the profile's start policy refuses this operation or read by name, whatever else grants it.
     */
    public function deniesOperation(string $name): bool
    {
        return in_array($name, $this->start->access->denials, true);
    }

    /**
     * @param  class-string<Policy>  $policy
     */
    public function grants(string $policy, AccessType $access): bool
    {
        return $this->authorization->grants($policy, $access);
    }
}
