<?php

declare(strict_types=1);

namespace App\Support\Gateways\Tunler;

use App\Data\Sharing\TunlerStatusData;
use App\Exceptions\TunlerStatusUnreadable;
use JsonException;
use Spatie\LaravelData\Exceptions\CannotCreateData;
use TypeError;

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
            $status = TunlerStatusData::from(json_decode($output, true, 4, JSON_THROW_ON_ERROR));
        } catch (JsonException|CannotCreateData|TypeError $failure) {
            throw TunlerStatusUnreadable::because($failure);
        }

        return new self($status->loggedIn && $status->isAuthenticated, $status->host);
    }
}
