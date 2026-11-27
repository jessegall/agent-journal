<?php

declare(strict_types=1);

namespace App\Hosts;

use App\Agents\Drivers\DefaultDrivers;
use App\Hosts\Protocol\Payloads\HostContainerRunPayload;
use App\Hosts\Protocol\Payloads\HostContainerRunResultPayload;

/**
 * The checks a built driver image passes before any start runs on it, as build.sh's protected start check: a command
 * through the shell bridge, started by journal-init, runs as the executor's user. A Codex image is also checked
 * through its program user's login shell, the shell Codex runs the model's commands in.
 */
final readonly class DriverImageChecks
{
    /**
     * The executor's user, whom every command through the bridge must run as.
     */
    public const string EXECUTOR_USER = '10002';

    private const string INIT = '/opt/journal/bin/journal-init';

    private const string BRIDGE = '/opt/journal/shell/bash';

    private const string LOGIN_SHELL_OF_PROGRAM_USER = 'exec "$(getent passwd 10001 | cut -d: -f7)" -c "id -u"';

    private const int OUTPUT_LIMIT = 256;

    private const int DEADLINE_MS = 60_000;

    private const array NO_BUDGETS = [
        'cpuCores' => 0,
        'memoryBytes' => 0,
        'memorySwapBytes' => 0,
        'processes' => 0,
        'openFiles' => 0,
    ];

    /**
     * The checks of the image built from the driver folder, one result expected for each, in order.
     *
     * @return list<HostContainerRunPayload>
     */
    public function of(string $image, string $folder): array
    {
        $checks = [$this->run($image, [self::BRIDGE, '-c', 'id -u'])];

        if (basename($folder) === DefaultDrivers::CODEX) {
            $checks[] = $this->run($image, ['/bin/sh', '-c', self::LOGIN_SHELL_OF_PROGRAM_USER]);
        }

        return $checks;
    }

    /**
     * Whether the results are one passing result for each check: exit 0, in time, whole, and printing only the
     * executor's user, with at most its trailing newline.
     *
     * @param  list<HostContainerRunPayload>  $checks
     * @param  list<HostContainerRunResultPayload>  $results
     */
    public function pass(array $checks, array $results): bool
    {
        if (count($results) !== count($checks)) {
            return false;
        }

        return array_all($results, $this->passes(...));
    }

    private function passes(HostContainerRunResultPayload $result): bool
    {
        $printed = str_ends_with($result->stdout, "\n") ? substr($result->stdout, 0, -1) : $result->stdout;
        $isWhole = ! $result->isTimedOut && ! $result->isTruncated;

        return $result->exitCode === 0 && $isWhole && $printed === self::EXECUTOR_USER;
    }

    /**
     * @param  list<string>  $command
     */
    private function run(string $image, array $command): HostContainerRunPayload
    {
        return HostContainerRunPayload::from([
            'manifest' => [
                'name' => '',
                'image' => $image,
                'user' => '0:0',
                'workdir' => '/',
                'entrypoint' => [],
                'isReadOnlyRoot' => true,
                'capabilities' => ['SETUID', 'SETGID', 'SETPCAP'],
                'blocksNewPrivileges' => false,
                'network' => 'none',
                'networkLabels' => [],
                'mounts' => [],
                'tmpfs' => [['target' => '/run/journal-exec', 'options' => 'uid=10002,gid=10001,mode=0750,size=1m']],
                'volumes' => [],
                'labels' => [],
                'budgets' => self::NO_BUDGETS,
                'securityOptions' => ['seccomp' => '', 'apparmor' => ''],
                'isAttachable' => false,
                'takesInput' => false,
                'restart' => 'no',
                'preparations' => [],
            ],
            'command' => [self::INIT, '--', ...$command],
            'environment' => [],
            'input' => null,
            'inputSecret' => null,
            'outputLimit' => self::OUTPUT_LIMIT,
            'deadlineMs' => self::DEADLINE_MS,
        ]);
    }
}
