<?php

declare(strict_types=1);

namespace App\Agents;

use App\Agents\Drivers\Enums\StartProfileType;
use App\Agents\Enums\WorkspaceUse;
use App\Agents\Exceptions\ManifestRefused;
use App\Files\ManifestMount;
use App\Files\Values\WorkspacePreparation;
use App\Sessions\Values\ExecutionPolicy;
use App\Support\MountRules;
use App\Values\ExecutionBudgets;
use JsonSerializable;

/**
 * What the protected host starts a helper container with: the image by
 * digest, an unprivileged user, a read-only root without capabilities, the mounts its arrangement allows, its
 * security profiles, rotated logs and the start's budgets, which size its tmpfs folders, and where a contained
 * workspace comes from. It is validated when built; anything else is refused by name.
 */
final readonly class ContainerManifest implements JsonSerializable
{
    public const string USER = '10001:10001';

    public const string WORKDIR = '/workspace';

    public const int LOG_BYTES = 10 * 1024 * 1024;

    public const int LOG_FILES = 3;

    /**
     * @param  list<string>  $capabilities
     * @param  list<ManifestMount>  $mounts
     * @param  list<int>  $publishedPorts
     */
    private function __construct(
        public string $image,
        public string $user,
        public string $workdir,
        public bool $isReadOnlyRoot,
        public array $capabilities,
        public bool $blocksNewPrivileges,
        public SecurityOptions $securityOptions,
        public bool $isPrivileged,
        public string $network,
        public array $mounts,
        public array $publishedPorts,
        public ExecutionBudgets $budgets,
        public bool $isAttachable,
        // What the host fills or checks before the container mounts the workspace; none locally.
        public WorkspacePreparation|null $workspacePreparation,
        public StartProfileType $startProfile,
    ) {}

    /**
     * The manifest as the host reads it, with the budgets under their property names.
     *
     * @return array<string, mixed>
     */
    public function jsonSerialize(): array
    {
        return [
            ...get_object_vars($this),
            'budgets' => $this->budgets->hostBudgets(),
        ];
    }

    /**
     * The manifest of one session's start: its workspace mounted at /workspace as its arrangement places it and as the
     * session uses it, read-only, shared or its own clone; its driver its own terminal process when the execution
     * policy makes it attachable.
     *
     * @throws ManifestRefused
     */
    public static function compile(
        string $sessionId,
        string $workspace,
        WorkspaceUse $use,
        ExecutionPolicy $policy,
        string $network,
        MountRules $rules,
        string|null $resumedSessionId,
        StartProfileType $startProfile = StartProfileType::Standard,
    ): self {
        $mount = $rules->workspaceMount($workspace, $use);

        return self::make(
            (string) $policy->imageReference,
            $startProfile->user(),
            true,
            $startProfile->capabilities(),
            false,
            $network,
            [$mount, ...$rules->accountMounts(), ...$rules->sessionMounts($sessionId, $resumedSessionId)],
            [],
            $policy->budgets,
            $rules,
            SecurityOptions::none(),
            $policy->isAttachable,
            $startProfile,
        );
    }

    /**
     * The manifest of a throwaway check of the agent image: its standard user on a read-only root, no capability, no
     * network and no mount, under the security profiles the agent containers run under.
     */
    public static function probe(string $image, SecurityOptions $securityOptions): self
    {
        $profile = StartProfileType::Standard;

        return new self(
            $image,
            $profile->user(),
            self::WORKDIR,
            true,
            $profile->capabilities(),
            true,
            $securityOptions,
            false,
            'none',
            [],
            [],
            ExecutionBudgets::defaults(),
            false,
            null,
            $profile,
        );
    }

    /**
     * @param  list<string>  $capabilities
     * @param  list<ManifestMount>  $mounts
     * @param  list<int>  $publishedPorts
     *
     * @throws ManifestRefused
     */
    public static function make(
        string $image,
        string $user,
        bool $isReadOnlyRoot,
        array $capabilities,
        bool $isPrivileged,
        string $network,
        array $mounts,
        array $publishedPorts,
        ExecutionBudgets $budgets,
        MountRules $rules,
        SecurityOptions $securityOptions,
        bool $isAttachable = false,
        StartProfileType $startProfile = StartProfileType::Standard,
    ): self {
        if (preg_match('/(^|@)sha256:[0-9a-f]{64}$/', $image) !== 1) {
            throw ManifestRefused::because("the image {$image} is not named by its digest");
        }

        $matchesProfile = $user === $startProfile->user() && $capabilities === $startProfile->capabilities();

        if ($isPrivileged || ! $matchesProfile || ! $isReadOnlyRoot) {
            throw ManifestRefused::because(match ($startProfile) {
                StartProfileType::Standard => 'a helper runs unprivileged as 10001:10001 on a read-only root with no capabilities',
                StartProfileType::ProtectedAccount => 'a protected start runs its init as 0:0 with only SETUID, SETGID and SETPCAP, unprivileged, on a read-only root',
            });
        }

        if ($startProfile->isForAnAccount() && ! $rules->bindsAccount($mounts)) {
            throw ManifestRefused::because('a protected start binds the account folder it protects');
        }

        if (in_array($network, ['host', 'none', ''], true)) {
            throw ManifestRefused::because("the network {$network} is not a dedicated start network");
        }

        if ($publishedPorts !== []) {
            throw ManifestRefused::because('a helper publishes no ports');
        }

        $rules->assertPermits($mounts);

        return new self(
            $image,
            $user,
            self::WORKDIR,
            true,
            $capabilities,
            true,
            $securityOptions,
            false,
            $network,
            $mounts,
            [],
            $budgets,
            $isAttachable,
            $rules->workspacePreparation(),
            $startProfile,
        );
    }
}
