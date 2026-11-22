<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Exceptions\AccountFolderRefused;
use App\Support\HostAccountFolders;
use App\Support\HostStartSocket;
use Tests\TestCase;

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

    public function test_a_make_whose_reply_is_lost_is_sent_again_with_the_same_operation(): void
    {
        $socket = sys_get_temp_dir().'/journal-folders-'.getmypid().'.sock';
        $log = sys_get_temp_dir().'/journal-folders-'.getmypid().'.log';
        @unlink($socket);
        @unlink($log);
        $server = proc_open([PHP_BINARY, '-r', self::SERVER, $socket, $log], [], $pipes);
        $this->assertIsResource($server);
        $this->waitFor(fn () => file_exists($socket));

        new HostAccountFolders(new HostStartSocket($socket))->make('/srv/journal/accounts/a1');
        proc_close($server);

        $lines = file($log, FILE_IGNORE_NEW_LINES);
        $this->assertIsArray($lines);
        $requests = array_map(fn (string $line) => json_decode($line, true, flags: JSON_THROW_ON_ERROR), $lines);
        $this->assertCount(2, $requests);
        $this->assertSame($requests[0], $requests[1]);
        $this->assertSame('a1', $requests[0]['makeFolder']['folder']);
        $this->assertNotSame('', $requests[0]['makeFolder']['operation']);
    }

    /**
     * A stand-in host that reads two requests, logs each, drops the first without a reply and answers the second.
     */
    private const string SERVER = <<<'PHP'
        [, $path, $log] = $argv;
        $server = stream_socket_server('unix://'.$path);
        foreach ([false, true] as $answers) {
            $connection = stream_socket_accept($server, 10);
            file_put_contents($log, fgets($connection), FILE_APPEND);
            if ($answers) {
                fwrite($connection, '{"isDone":true}'."\n");
            }
            fclose($connection);
        }
        PHP;

    private function waitFor(callable $condition): void
    {
        for ($tries = 0; $tries < 100 && ! $condition(); $tries++) {
            usleep(20_000);
        }
    }
}
