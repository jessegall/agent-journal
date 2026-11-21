<?php

declare(strict_types=1);

namespace App\Files\Enums;

/**
 * A reason, settled with the user, why code may touch a file outside the funnel's places (doc 69).
 */
enum PlaceExemption: string
{
    case CommandFileSystem = 'command-file-system';
    case UserNamedFile = 'user-named-file';
    case GatewayBinary = 'gateway-binary';
    case HostSecretFile = 'host-secret-file';

    public function description(): string
    {
        return match ($this) {
            self::CommandFileSystem => "the classified command's own file system: its folder, tools and worktree",
            self::UserNamedFile => 'a file the user names on the command line, wherever it lies',
            self::GatewayBinary => "a sharing gateway's program in the host's tool folders",
            self::HostSecretFile => "the host's secret file the sign-in runner is given",
        };
    }
}
