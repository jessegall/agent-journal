<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Exceptions\ServerOriginInvalid;

/**
 * The canonical origin connected machines reach this journal at, as configured (agents.server_origin); never read
 * from a request's Host header.
 */
final readonly class ServerOrigin
{
    public function __construct(private string $configured) {}

    public function isHttps(): bool
    {
        return parse_url($this->configured, PHP_URL_SCHEME) === 'https'
            && preg_match('/\A[A-Za-z0-9.-]+\z/', (string) parse_url($this->configured, PHP_URL_HOST)) === 1;
    }

    /**
     * The server's name as its owner reads it: its host name, or "this server" while no https origin is set.
     */
    public function name(): string
    {
        if (! $this->isHttps()) {
            return 'this server';
        }

        return (string) parse_url($this->configured, PHP_URL_HOST);
    }

    /**
     * The origin as https://host or https://host:port, with no path, query or anything a shell would read.
     *
     * @throws ServerOriginInvalid
     */
    public function canonical(): string
    {
        if (! $this->isHttps()) {
            throw ServerOriginInvalid::for($this->configured);
        }

        $port = parse_url($this->configured, PHP_URL_PORT);
        $host = (string) parse_url($this->configured, PHP_URL_HOST);

        return is_int($port) ? "https://{$host}:{$port}" : "https://{$host}";
    }
}
