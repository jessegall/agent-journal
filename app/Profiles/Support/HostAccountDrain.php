<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use TypeError;
use Spatie\LaravelData\Exceptions\CannotCreateData;
use JsonException;
use App\Profiles\Data\DrainReplyData;
use App\Agents\Enums\ArrangementType;
use App\Profiles\Contracts\AccountOwnerDrain;

/**
 * Asks the protected host, over its start socket, to end the account's shared owner and every execution on it, naming
 * the account by its folder (the local host's way) and its id (the contained host's). Locally, no protected host
 * means nothing of the account can run; a contained journal always has one, so an unset socket refuses there. A host
 * that cannot be reached, or cannot prove the end, keeps the account unchanged.
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

        $connection = @stream_socket_client('unix://'.$this->socket, timeout: self::REPLY_SECONDS);

        if ($connection === false) {
            return false;
        }

        stream_set_timeout($connection, self::REPLY_SECONDS);
        $request = ['drain' => ['account' => $directory, 'accountId' => $accountId]];
        fwrite($connection, json_encode($request, JSON_THROW_ON_ERROR)."\n");
        $line = (string) fgets($connection);
        fclose($connection);

        try {
            return DrainReplyData::from(json_decode($line, true, 512, JSON_THROW_ON_ERROR))->drained;
        } catch (JsonException|CannotCreateData|TypeError) {
            return false;
        }
    }
}
