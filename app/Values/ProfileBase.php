<?php

declare(strict_types=1);

namespace App\Values;

use App\Agents\Drivers\Enums\DriverType;
use App\Agents\Enums\AccessType;
use App\Agents\Enums\ExecutionModeType;
use App\Exceptions\BuiltInProfileMissing;
use App\Profiles\Enums\ModelTier;
use App\Profiles\Values\HostAccess;
use App\Sessions\Enums\OfflineReplyMode;
use App\Sessions\Values\ProcessGrants;

/**
 * The built-in profile a profile starts from, as data: its access defaults, where it runs, its first stop conditions,
 * its offline reply and whether it may do what only a coordinator may. A profile's own fields only override it, and
 * no code branches on which base it is; it is told apart by its key, which is also the built-in profile's key.
 */
final readonly class ProfileBase
{
    /**
     * @param  list<AccessType>  $grants  the accesses its built-in profile may be granted on any policy that accepts them
     * @param  list<HostAccess>  $paths  the roots its profiles work in on the host, with the accesses each permits
     * @param  list<StopCondition>  $stopConditions
     */
    private function __construct(
        public string $key,
        public string $label,
        public string $description,
        public ModelTier $tier,
        public array $grants,
        public array $paths,
        public ExecutionModeType $executionMode,
        public bool $isContainerRequired,
        public array $stopConditions,
        public OfflineReplyMode $offlineReply,
        public bool $isCoordinator,
        // What its sessions may use in a container on a server; locally every start keeps the defaults.
        public ExecutionBudgets $containedBudgets,
        // Whether its driver is its container's own terminal process, which the host attaches to, again after a
        // restart: the main agent's is; a helper runs without a terminal.
        public bool $isAttachable,
        // How its sessions run when a start names no driver type: the main agent in a terminal, a helper headless.
        public DriverType $defaultDriverType,
    ) {}

    /**
     * The main agent: it changes and runs the workspace on the protected host, coordinates the journal's work and
     * keeps working while the journal is away.
     */
    public static function mainAgent(): self
    {
        return new self(
            'main-agent',
            'Main agent',
            'Changes and runs the project on this machine, and coordinates the journal\'s work.',
            ModelTier::Inventive,
            [...self::looking(), ...self::changing(), AccessType::Delegate, ...self::running()],
            [HostAccess::root('.', [...self::looking(), ...self::changing(), ...self::running()])],
            ExecutionModeType::ProtectedHost,
            false,
            [],
            OfflineReplyMode::Neutral,
            true,
            ExecutionBudgets::mainAgent(),
            true,
            DriverType::Headless
        );
    }

    /**
     * A helper that reads and runs commands in a container and changes no workspace file.
     */
    public static function readOnlyHelper(): self
    {
        return new self(
            'read-only-helper',
            'Read-only helper',
            'Reads, searches and runs commands in a container, and changes no file of the project.',
            ModelTier::General,
            [...self::journalWork(), AccessType::Execute],
            [HostAccess::root('.', [...self::looking(), AccessType::Execute])],
            ExecutionModeType::RequiredContainer,
            false,
            [],
            OfflineReplyMode::Refuse,
            false,
            ExecutionBudgets::defaults(),
            false,
            DriverType::Headless,
        );
    }

    /**
     * A helper that changes the workspace, always in a required container, and leaves a clean worktree.
     */
    public static function writingHelper(): self
    {
        return new self(
            'writing-helper',
            'Writing helper',
            'Changes the project\'s files for one bounded job, in a container of its own.',
            ModelTier::General,
            [...self::journalWork(), ...self::running()],
            [HostAccess::root('.', [...self::looking(), ...self::changing(), ...self::running()])],
            ExecutionModeType::RequiredContainer,
            true,
            [StopCondition::cleanWorktree()],
            OfflineReplyMode::Refuse,
            false,
            ExecutionBudgets::defaults(),
            false,
            DriverType::Headless,
        );
    }

    /**
     * @return list<self>
     */
    public static function all(): array
    {
        return [
            self::mainAgent(),
            self::writingHelper(),
            self::readOnlyHelper(),
        ];
    }

    /**
     * @throws BuiltInProfileMissing when no built-in profile has the key
     */
    public static function of(string $key): self
    {
        foreach (self::all() as $base) {
            if ($base->key === $key) {
                return $base;
            }
        }

        throw BuiltInProfileMissing::forKey($key);
    }

    public function is(self $other): bool
    {
        return $this->key === $other->key;
    }

    /**
     * Where a start runs unless its profile says otherwise.
     */
    public function defaultExecutionMode(): ExecutionModeType
    {
        return $this->executionMode;
    }

    /**
     * Whether a contained start's driver is its container's own terminal process, which the host attaches to.
     */
    public function isAttachable(): bool
    {
        return $this->isAttachable;
    }

    /**
     * Whether starts from this base must stay in a required container whatever their profile says.
     */
    public function isContainerRequired(): bool
    {
        return $this->isContainerRequired;
    }

    /**
     * The stop conditions a profile from this base starts with.
     *
     * @return list<StopCondition>
     */
    public function defaultStopConditions(): array
    {
        return $this->stopConditions;
    }

    /**
     * The global access defaults; a project and a profile only override them. A base that
     * changes no workspace file runs reading commands only.
     */
    public function defaultAccess(): AccessPolicy
    {
        $processes = $this->mayChangeWorkspaceFiles() ? ProcessGrants::everything() : ProcessGrants::readingOnly();

        return AccessPolicy::from(['paths' => $this->paths, 'destinations' => [], 'processes' => $processes]);
    }

    /**
     * Whether a profile from this base may change workspace files at all; its overrides never pass this ceiling.
     */
    public function mayChangeWorkspaceFiles(): bool
    {
        return array_any($this->paths, fn (HostAccess $scope) => $scope->changesFiles());
    }

    /**
     * How a start answers while the journal is unreachable.
     */
    public function offlineReply(): OfflineReplyMode
    {
        return $this->offlineReply;
    }

    /**
     * Whether profiles from this base hold the accesses only a coordinator holds, such as dispatching work.
     */
    public function isCoordinator(): bool
    {
        return $this->isCoordinator;
    }

    /**
     * Whether profiles from this base change nothing in the workspace, so a policy's not-for-read-only accesses
     * stay out of their built-in grants.
     */
    public function isReadOnly(): bool
    {
        return ! $this->mayChangeWorkspaceFiles();
    }

    public function allows(AccessType $access): bool
    {
        return in_array($access, $this->grants, true);
    }

    /**
     * @return list<AccessType>
     */
    private static function looking(): array
    {
        return [
            AccessType::Read,
            AccessType::Search,
        ];
    }

    /**
     * @return list<AccessType>
     */
    private static function changing(): array
    {
        return [
            AccessType::Create,
            AccessType::Edit,
            AccessType::Delete,
        ];
    }

    /**
     * @return list<AccessType>
     */
    private static function running(): array
    {
        return [
            AccessType::Execute,
            AccessType::Test,
            AccessType::Build,
        ];
    }

    /**
     * @return list<AccessType>
     */
    private static function journalWork(): array
    {
        return [
            AccessType::Read,
            AccessType::Search,
            AccessType::Create,
            AccessType::Edit,
        ];
    }
}
