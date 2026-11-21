<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use Spatie\LaravelData\Data;

/**
 * The protected host's local start socket: one request line out, one reply line back, read as the given data.
 */
final readonly class HostStartSocket
{
    private const int REPLY_SECONDS = 30;

    public function __construct(public string $path) {}

    /**
     * Whether a socket is configured; an unset one means this sign-in service has no protected host to ask.
     */
    public function isConfigured(): bool
    {
        return $this->path !== '';
    }

    /**
     * Sends one request line and reads the host's one reply line as the given data; none when the host cannot be
     * reached or its reply is no JSON object.
     *
     * @template TReply of Data
     *
     * @param  array<string, array<string, string>>  $request
     * @param  class-string<TReply>  $replyClass
     * @return TReply|null
     */
    public function ask(array $request, string $replyClass): Data|null
    {
        $connection = @stream_socket_client('unix://'.$this->path, timeout: self::REPLY_SECONDS);

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
