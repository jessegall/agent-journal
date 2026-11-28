<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Enums;

use App\Hosts\Protocol\Payloads\HostContainerTmpfsPayload;

/**
 * How a helper container is started: the standard way, as one unprivileged user, or protected, where a root-owned
 * init starts the driver and the shell executor as two users and then drops its rights.
 */
enum StartProfileType: string
{
    case Standard = 'standard';
    case ProtectedAccount = 'protected-account';

    /**
     * The user the container starts as: the driver's own for a standard start, root for the init of a protected one.
     */
    public function user(): string
    {
        return match ($this) {
            self::Standard => '10001:10001',
            self::ProtectedAccount => '0:0',
        };
    }

    /**
     * The capabilities the container starts with: none for a standard start, only what the protected init needs to
     * start its two users and drop its own rights.
     *
     * @return list<string>
     */
    public function capabilities(): array
    {
        return match ($this) {
            self::Standard => [],
            self::ProtectedAccount => [
                'SETUID',
                'SETGID',
                'SETPCAP',
            ],
        };
    }

    /**
     * The program the container starts before its command: none for a standard start, the init that drops to its users
     * for a protected one, which takes the command after a --.
     *
     * @return list<string>
     */
    public function entrypoint(): array
    {
        return match ($this) {
            self::Standard => [],
            self::ProtectedAccount => ['/opt/journal/bin/journal-init'],
        };
    }

    /**
     * The command as the container runs it after its entrypoint.
     *
     * @param  list<string>  $command
     * @return list<string>
     */
    public function commandOf(array $command): array
    {
        return match ($this) {
            self::Standard => $command,
            self::ProtectedAccount => [
                '--',
                ...$command,
            ],
        };
    }

    /**
     * The memory folders the profile adds: for a protected start the executor's private socket folder.
     *
     * @return list<HostContainerTmpfsPayload>
     */
    public function tmpfs(): array
    {
        return match ($this) {
            self::Standard => [],
            self::ProtectedAccount => [HostContainerTmpfsPayload::from([
                'target' => '/run/journal-exec',
                'options' => 'uid=10002,gid=10001,mode=0750,size=1m',
            ])],
        };
    }

    /**
     * Whether the start is for an account folder: a protected start exists to keep that folder from the model.
     */
    public function isForAnAccount(): bool
    {
        return $this === self::ProtectedAccount;
    }
}
