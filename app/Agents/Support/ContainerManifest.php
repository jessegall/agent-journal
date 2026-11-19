<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Exceptions\ManifestRefused;
use App\Agents\Values\AccessPolicy;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;

/**
 * What the protected host starts a helper container with (doc 14, section 63): the image by digest, an unprivileged
 * user, a read-only root without capabilities, exactly one workspace mount, bounded tmpfs folders, rotated logs and
 * the launch's budgets. It is validated when built; anything else is refused by name.
 */
final readonly class ContainerManifest
{
    public const string USER = '10001:10001';

    public const string WORKDIR = '/workspace';

    public const string SECCOMP = 'verified-default';

    public const int LOG_BYTES = 10 * 1024 * 1024;

    public const int LOG_FILES = 3;

    /**
     * The tmpfs folders a helper writes to, with their size in bytes.
     */
    public const array TMPFS = [
        '/tmp' => 256 * 1024 * 1024,
        '/run/journal' => 16 * 1024 * 1024,
        '/home/journal' => 64 * 1024 * 1024,
    ];

    /**
     * Host folders that hold accounts, credentials or host control; no mount may name them.
     */
    private const array PROTECTED_SOURCES = [
        '/var/run/docker.sock',
        '/run/docker.sock',
        '/.ssh',
        '/.claude',
        '/.codex',
        '/.config',
        '/Library/Keychains',
        '/etc',
    ];

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
        public string $seccomp,
        public bool $privileged,
        public string $network,
        public array $mounts,
        public array $publishedPorts,
        public ExecutionBudgets $budgets,
    ) {}

    /**
     * The manifest of one prepared launch: its workspace mounted at /workspace, writable only when the launch's access
     * declaration grants changing workspace files, whatever the profile is called.
     *
     * @throws ManifestRefused
     */
    public static function compile(
        PreparedLaunch $launch,
        AccessPolicy $access,
        ExecutionPolicy $policy,
        string $network,
    ): self {
        $writable = $access->grants(AccessType::Edit, ResourceAreaType::Workspace);
        $mount = new ManifestMount($launch->workspace, self::WORKDIR, $writable);

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
    ): self {
        if (preg_match('/@sha256:[0-9a-f]{64}$/', $image) !== 1) {
            throw ManifestRefused::because("the image {$image} is not named by its digest");
        }

        if ($privileged || $capabilities !== [] || $user !== self::USER || ! $readOnlyRoot) {
            throw ManifestRefused::because('a helper runs unprivileged as 10001:10001 on a read-only root with no capabilities');
        }

        if (in_array($network, ['host', 'none', ''], true)) {
            throw ManifestRefused::because("the network {$network} is not a dedicated launch network");
        }

        if ($publishedPorts !== []) {
            throw ManifestRefused::because('a helper publishes no ports');
        }

        if (count($mounts) !== 1 || $mounts[0]->target !== self::WORKDIR) {
            throw ManifestRefused::because('a helper has exactly one mount, its workspace at /workspace');
        }

        self::checkSource($mounts[0]->source);

        return new self(
            $image,
            $user,
            self::WORKDIR,
            true,
            [],
            true,
            self::SECCOMP,
            false,
            $network,
            $mounts,
            [],
            $budgets,
        );
    }

    /**
     * @throws ManifestRefused
     */
    private static function checkSource(string $source): void
    {
        if (! str_starts_with($source, '/') || in_array('..', explode('/', $source), true) || substr_count(trim($source, '/'), '/') < 1) {
            throw ManifestRefused::because("the workspace {$source} is not an assigned workspace folder");
        }

        foreach (self::PROTECTED_SOURCES as $protected) {
            if (str_starts_with($source, $protected) || str_contains($source, $protected.'/') || str_ends_with($source, $protected)) {
                throw ManifestRefused::because("the mount {$source} reaches accounts, credentials or host control");
            }
        }
    }
}
