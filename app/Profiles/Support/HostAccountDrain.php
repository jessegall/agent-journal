<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Agents\Enums\ArrangementType;
use App\Profiles\Contracts\AccountOwnerDrain;
use App\Profiles\Data\DrainReplyData;
use App\Profiles\Data\FolderUseReplyData;
use Spatie\LaravelData\Data;

/**
 * Asks the protected host, over its start socket, to end the account's shared owner and every execution on it, naming
 * the account by its folder (the local host's way) and its id (the contained host's). Locally, no protected host
 * means nothing of the account can run; a contained journal always has one, so an unset socket refuses there. A host
 * that cannot be reached, or cannot prove the end, keeps the account unchanged. It also asks whether a container still
 * binds a displaced folder.
 */
final readonly class HostAccountDrain implements AccountOwnerDrain
{
    private const int REPLY_SECONDS = 30;

    public function __construct(
        private string $socket,
        private ArrangementType $arrangement,
    ) {}

    public function drain(string $directory, string|null $accountId): bool
    {
        if ($accountId === null) {
            return true;
        }

        if ($this->socket === '') {
            return ! $this->arrangement->isContained();
        }

        $reply = $this->askHost(['drain' => ['account' => $directory, 'accountId' => $accountId]], DrainReplyData::class);

        return $reply instanceof DrainReplyData && $reply->drained;
    }

    public function isDisplacedFolderFree(string $directory, string $accountId): bool
    {
        if (! $this->arrangement->isContained()) {
            return $this->drain($directory, $accountId);
        }

        if ($this->socket === '') {
            return false;
        }

        $reply = $this->askHost(['folderUse' => ['folder' => basename($directory)]], FolderUseReplyData::class);

        return $reply instanceof FolderUseReplyData && ! $reply->bound;
    }

    /**
     * Sends one request line over the start socket and reads the host's one reply line as the given data; none when
     * the host cannot be reached or its reply is no JSON object.
     *
     * @template TReply of Data
     *
     * @param  array<string, array<string, string>>  $request
     * @param  class-string<TReply>  $replyClass
     * @return TReply|null
     */
    private function askHost(array $request, string $replyClass): Data|null
    {
        $connection = @stream_socket_client('unix://'.$this->socket, timeout: self::REPLY_SECONDS);

        if ($connection === false) {
            return null;
        }

        stream_set_timeout($connection, self::REPLY_SECONDS);
        fwrite($connection, json_encode($request, JSON_THROW_ON_ERROR)."\n");
        $line = (string) fgets($connection);
        fclose($connection);

        $reply = trim($line);

        if (! str_starts_with($reply, '{') || ! json_validate($reply)) {
            return null;
        }

        return $replyClass::from($reply);
    }
}
