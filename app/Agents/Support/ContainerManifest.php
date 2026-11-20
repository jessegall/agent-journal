<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Exceptions\ManifestRefused;
use App\Agents\Values\AccessPolicy;

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
    ) {}

    /**
     * The manifest of one prepared start: its workspace mounted at /workspace, writable only when the start's access
     * declaration grants changing workspace files, whatever the profile is called.
     *
     * @throws ManifestRefused
     */
    public static function compile(
        PreparedStart $start,
        AccessPolicy $access,
        ExecutionPolicy $policy,
        string $network,
    ): self {
        $writable = $access->changesFiles();
        $mount = ManifestMount::bind($start->workspace, self::WORKDIR, $writable);

        return self::make(
            (string) $policy->imageReference,
            self::USER,
            true,
            [],
            false,
            $network,
            [$mount],
            [],
            $policy->budgets,
            MountRules::local(),
            SecurityOptions::none(),
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
    ): self {
        if (preg_match('/@sha256:[0-9a-f]{64}$/', $image) !== 1) {
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
        );
    }
}
