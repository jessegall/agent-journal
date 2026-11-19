<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Profiles\Contracts\AccountOwnerDrain;

/**
 * Asks the protected host on this machine, over its local start socket, to end the account's shared owner and every
 * execution on it. With no protected host here, nothing of the account can run, so there is nothing to end; a host
 * that cannot be reached, or cannot prove the end, keeps the account unchanged.
 */
final readonly class HostAccountDrain implements AccountOwnerDrain
{
    private const int REPLY_SECONDS = 30;

    public function __construct(private string $socket) {}

    public function drain(string $directory): bool
    {
        if ($this->socket === '') {
            return true;
        }

        $connection = @stream_socket_client('unix://'.$this->socket, timeout: self::REPLY_SECONDS);

        if ($connection === false) {
            return false;
        }

        stream_set_timeout($connection, self::REPLY_SECONDS);
        fwrite($connection, json_encode(['drain' => ['account' => $directory]], JSON_THROW_ON_ERROR)."\n");
        $reply = json_decode((string) fgets($connection), true);
        fclose($connection);

        return is_array($reply) && ($reply['drained'] ?? false) === true;
    }
}
