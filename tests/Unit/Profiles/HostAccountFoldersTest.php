<?php

declare(strict_types=1);

namespace Tests\Unit\Profiles;

use App\Profiles\Exceptions\AccountFolderRefused;
use App\Profiles\Support\HostAccountFolders;
use App\Profiles\Support\HostStartSocket;
use PHPUnit\Framework\TestCase;

/**
 * Where agents run in containers, an account folder is made by the agent host; a host that cannot be reached
 * refuses the folder instead of the sign-in service making it itself.
 */
final class HostAccountFoldersTest extends TestCase
{
    public function test_a_folder_the_host_cannot_be_asked_for_is_refused(): void
    {
        $folders = new HostAccountFolders(new HostStartSocket(sys_get_temp_dir().'/no-journal-host-'.getmypid().'.sock'));

        $this->expectException(AccountFolderRefused::class);

        $folders->make('/srv/journal/accounts/a1');
    }
}
