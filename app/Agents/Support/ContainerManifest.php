<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Exceptions\ManifestRefused;
use App\Agents\Values\AccessPolicy;
use App\Agents\Values\ExecutionBudgets;
use App\Agents\Values\ExecutionPolicy;

/**
 * What the protected host starts a helper container with (doc 14, section 63; doc 61, decision 6): the image by
 * digest, an unprivileged user, a read-only root without capabilities, the mounts its arrangement allows, its
 * security profiles, rotated logs and the start's budgets, which size its tmpfs folders. It is validated when built;
 * anything else is refused by name.
 */
final readonly class ContainerManifest
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
        public bool $readOnlyRoot,
        public array $capabilities,
        public bool $noNewPrivileges,
        public SecurityOptions $securityOptions,
        public bool $privileged,
        public string $network,
        public array $mounts,
        public array $publishedPorts,
        public ExecutionBudgets $budgets,
        public bool $attachable,
    ) {}

    /**
     * The manifest of one session's start: its workspace mounted at /workspace as its arrangement places it, writable
     * only when the start's access declaration grants changing workspace files, whatever the profile is called; its
     * program its own terminal process when the execution policy makes it attachable.
     *
     * @throws ManifestRefused
     */
    public static function compile(
        string $sessionId,
        string $workspace,
        AccessPolicy $access,
        ExecutionPolicy $policy,
        string $network,
        MountRules $rules,
        string|null $resumedSessionId,
    ): self {
        $mount = $rules->workspaceMount($workspace, $access->changesFiles());

        return self::make(
            (string) $policy->imageReference,
            self::USER,
            true,
            [],
            false,
            $network,
            [$mount, ...$rules->accountMounts(), ...$rules->sessionMounts($sessionId, $resumedSessionId)],
            [],
            $policy->budgets,
            $rules,
            SecurityOptions::none(),
            $policy->attachable,
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
        bool $readOnlyRoot,
        array $capabilities,
        bool $privileged,
        string $network,
        array $mounts,
        array $publishedPorts,
        ExecutionBudgets $budgets,
        MountRules $rules,
        SecurityOptions $securityOptions,
        bool $attachable = false,
    ): self {
        if (preg_match('/(^|@)sha256:[0-9a-f]{64}$/', $image) !== 1) {
            throw ManifestRefused::because("the image {$image} is not named by its digest");
        }

        if ($privileged || $capabilities !== [] || $user !== self::USER || ! $readOnlyRoot) {
            throw ManifestRefused::because('a helper runs unprivileged as 10001:10001 on a read-only root with no capabilities');
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
            [],
            true,
            $securityOptions,
            false,
            $network,
            $mounts,
            [],
            $budgets,
            $attachable,
        );
    }
}
