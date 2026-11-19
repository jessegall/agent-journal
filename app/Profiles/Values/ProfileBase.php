<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use App\Agents\Enums\ExecutionModeType;
use App\Agents\Enums\OfflineReplyMode;
use App\Agents\Values\AccessPolicy;
use App\Agents\Values\ClassGrant;
use App\Agents\Values\StopCondition;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Processes\Values\ProcessGrants;
use App\Profiles\Exceptions\BuiltInProfileMissing;

/**
 * The built-in profile a profile starts from, as data: its access defaults, where it runs, its first stop conditions,
 * its offline reply and whether it may do what only a coordinator may. A profile's own fields only override it, and
 * no code branches on which base it is; it is told apart by its key, which is also the built-in profile's key.
 */
final readonly class ProfileBase
{
    /**
     * @param  list<ClassGrant>  $classGrants
     * @param  list<StopCondition>  $stopConditions
     */
    private function __construct(
        public string $key,
        public string $label,
        public string $model,
        public array $classGrants,
        public ExecutionModeType $executionMode,
        public bool $containerRequired,
        public array $stopConditions,
        public OfflineReplyMode $offlineReply,
        public bool $coordinator,
    ) {}

    /**
     * The main agent: it changes and runs the workspace on the protected host, coordinates the journal's work and
     * keeps working while the journal is away.
     */
    public static function mainAgent(): self
    {
        return new self('main-agent', 'Main agent', 'opus', [
            new ClassGrant(ResourceAreaType::Workspace, [...self::looking(), ...self::changing(), ...self::running()]),
            new ClassGrant(ResourceAreaType::JournalContent, [...self::looking(), ...self::changing()]),
            new ClassGrant(
                ResourceAreaType::JournalWork,
                [...self::looking(), ...self::changing(), AccessType::Delegate],
            ),
            new ClassGrant(ResourceAreaType::JournalControl, self::looking()),
        ], ExecutionModeType::ProtectedHost, false, [], OfflineReplyMode::Neutral, true);
    }

    /**
     * A helper that reads and runs commands in a container and changes no workspace file.
     */
    public static function readOnlyHelper(): self
    {
        return new self('read-only-helper', 'Read-only helper', 'sonnet', [
            new ClassGrant(ResourceAreaType::Workspace, [...self::looking(), AccessType::Execute]),
            new ClassGrant(ResourceAreaType::JournalContent, self::journalWork()),
            new ClassGrant(ResourceAreaType::JournalWork, self::journalWork()),
        ], ExecutionModeType::RequiredContainer, false, [], OfflineReplyMode::Refuse, false);
    }

    /**
     * A helper that changes the workspace, always in a required container, and leaves a clean worktree.
     */
    public static function writingHelper(): self
    {
        return new self('writing-helper', 'Writing helper', 'sonnet', [
            new ClassGrant(ResourceAreaType::Workspace, [...self::looking(), ...self::changing(), ...self::running()]),
            new ClassGrant(ResourceAreaType::Scratch, [...self::looking(), ...self::changing(), ...self::running()]),
            new ClassGrant(ResourceAreaType::JournalContent, self::journalWork()),
            new ClassGrant(ResourceAreaType::JournalWork, self::journalWork()),
        ], ExecutionModeType::RequiredContainer, true, [
            StopCondition::cleanWorktree(),
        ], OfflineReplyMode::Refuse, false);
    }

    /**
     * @return list<self>
     */
    public static function all(): array
    {
        return [self::mainAgent(), self::writingHelper(), self::readOnlyHelper()];
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
     * Whether starts from this base must stay in a required container whatever their profile says.
     */
    public function isContainerRequired(): bool
    {
        return $this->containerRequired;
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
     * The global access defaults (doc 14, section 51); a project and a profile only override them. A base that
     * changes no workspace file runs reading commands only.
     */
    public function defaultAccess(): AccessPolicy
    {
        $processes = $this->mayChangeWorkspaceFiles() ? ProcessGrants::everything() : ProcessGrants::readingOnly();

        return AccessPolicy::make($this->classGrants, [], [], [], [], $processes);
    }

    /**
     * Whether a profile from this base may change workspace files at all; its overrides never pass this ceiling.
     */
    public function mayChangeWorkspaceFiles(): bool
    {
        return array_any($this->classGrants, fn (ClassGrant $grant) => $grant->changesWorkspaceFiles());
    }

    /**
     * How a start answers while the journal is unreachable.
     */
    public function offlineReply(): OfflineReplyMode
    {
        return $this->offlineReply;
    }

    /**
     * Whether profiles from this base hold the abilities only a coordinator holds, such as dispatching work.
     */
    public function isCoordinator(): bool
    {
        return $this->coordinator;
    }

    /**
     * @return list<AccessType>
     */
    private static function looking(): array
    {
        return [AccessType::Read, AccessType::Search];
    }

    /**
     * @return list<AccessType>
     */
    private static function changing(): array
    {
        return [AccessType::Create, AccessType::Edit, AccessType::Delete];
    }

    /**
     * @return list<AccessType>
     */
    private static function running(): array
    {
        return [AccessType::Execute, AccessType::Test, AccessType::Build];
    }

    /**
     * @return list<AccessType>
     */
    private static function journalWork(): array
    {
        return [AccessType::Read, AccessType::Search, AccessType::Create, AccessType::Edit];
    }
}
