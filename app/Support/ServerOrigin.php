<?php

declare(strict_types=1);

namespace App\Support;

use App\Exceptions\ServerOriginInvalid;

/**
 * The canonical origin connected machines reach this journal at, as configured (agents.server_origin); never read
 * from a request's Host header. It is an https origin, or, only while the app runs locally, a plain http origin on
 * this machine or a private network address, so a folder on the same Mac or network can connect for a test.
 */
final readonly class ServerOrigin
{
    public function __construct(private string $configured, private bool $runsLocally = false) {}

    /**
     * Whether install lines may name this origin: https, or local plain http as the class says.
     */
    public function isUsable(): bool
    {
        return $this->hasPlainHost() && ($this->scheme() === 'https' || $this->isLocalHttp());
    }

    /**
     * The server's name as its owner reads it: its host name, or "this server" while no usable origin is set.
     */
    public function name(): string
    {
        if (! $this->isUsable()) {
            return 'this server';
        }

        return (string) parse_url($this->configured, PHP_URL_HOST);
    }

    /**
     * The origin as scheme://host or scheme://host:port, with no path, query or anything a shell would read.
     *
     * @throws ServerOriginInvalid
     */
    public function canonical(): string
    {
        if (! $this->isUsable()) {
            throw ServerOriginInvalid::for($this->configured);
        }

        $port = parse_url($this->configured, PHP_URL_PORT);
        $host = (string) parse_url($this->configured, PHP_URL_HOST);
        $scheme = $this->scheme();

        if (is_int($port)) {
            return "{$scheme}://{$host}:{$port}";
        }

        return "{$scheme}://{$host}";
    }

    private function scheme(): string
    {
        return (string) parse_url($this->configured, PHP_URL_SCHEME);
    }

    private function hasPlainHost(): bool
    {
        return preg_match('/\A[A-Za-z0-9.-]+\z/', (string) parse_url($this->configured, PHP_URL_HOST)) === 1;
    }

    /**
     * Whether a call over plain http may be taken: only for a usable local http origin, never on a server.
     */
    public function canTakePlainHttp(): bool
    {
        return $this->hasPlainHost() && $this->isLocalHttp();
    }

    /**
     * Plain http to localhost, a loopback address or a private network address, while the app runs locally.
     */
    private function isLocalHttp(): bool
    {
        if (! $this->runsLocally || $this->scheme() !== 'http') {
            return false;
        }

        $host = (string) parse_url($this->configured, PHP_URL_HOST);

        if ($host === 'localhost') {
            return true;
        }

        return filter_var($host, FILTER_VALIDATE_IP) !== false
            && filter_var($host, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) === false;
    }
}
