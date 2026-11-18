<?php

declare(strict_types=1);

namespace App\Sharing\Gateways\Tunler;

use App\Sharing\Exceptions\TunlerStatusUnreadable;
use JsonException;

/**
 * What `tunler status --json` reports: whether the journal is logged in with a working login, and to which host.
 */
final readonly class TunlerStatus
{
    public function __construct(
        public bool $isLoggedIn,
        public string|null $host,
    ) {}

    /**
     * @throws TunlerStatusUnreadable
     */
    public static function fromOutput(string $output): self
    {
        try {
            $status = json_decode($output, true, 4, JSON_THROW_ON_ERROR);
        } catch (JsonException $failure) {
            throw TunlerStatusUnreadable::because($failure);
        }

        if (! is_array($status)) {
            throw TunlerStatusUnreadable::because();
        }

        $host = $status['host'] ?? null;

        return new self(
            ($status['logged_in'] ?? false) === true && ($status['auth_ok'] ?? false) === true,
            is_string($host) ? $host : null,
        );
    }
}
