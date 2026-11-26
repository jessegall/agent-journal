<?php

declare(strict_types=1);

namespace App\Support;

use App\Data\Messages\PrivateInputMessageData;
use App\Enums\Drivers\DriverOperation;
use App\Exceptions\PrivateValueRefused;
use App\Values\ClaimedRequest;
use Illuminate\Contracts\Cache\Repository;

/**
 * A browser writer's private value on its way to the host: kept only in the cache, under its single-use submission
 * id, for at most half a minute, and taken out the moment the host claims the request that names it. The request row
 * names the submission alone; the value is never written to the database, a log or a receipt.
 */
final readonly class PrivateValues
{
    /**
     * How long a private value waits for its host before it is gone.
     */
    public const int KEEP_SECONDS = 30;

    public function __construct(private Repository $cache) {}

    public function keep(string $submissionId, string $value): void
    {
        $this->cache->put($this->key($submissionId), $value, self::KEEP_SECONDS);
    }

    /**
     * The claimed requests as a host that drives its own runtimes receives them: a private input carries its value,
     * read once and deleted; any other request is as it was. A value that is gone leaves the request without one,
     * and the host writes nothing. A runtime the journal drives gets no value: its host pulls it for the write.
     */
    public function carriedBy(ClaimedRequests $claimed): ClaimedRequests
    {
        return new ClaimedRequests(array_map($this->carried(...), $claimed->requests));
    }

    private function carried(ClaimedRequest $claimed): ClaimedRequest
    {
        if ($claimed->operation !== DriverOperation::PrivateInput->value || $claimed->message === null) {
            return $claimed;
        }

        $fields = PrivateInputMessageData::from(json_decode($claimed->message, true, flags: JSON_THROW_ON_ERROR));
        $value = $this->cache->pull($this->key($fields->submissionId));

        if (! is_string($value)) {
            return $claimed;
        }

        return $claimed->withMessage(json_encode([
            ...$fields->toArray(),
            'value' => $value,
        ], JSON_THROW_ON_ERROR));
    }

    /**
     * Names the host a write of the submission was ordered on, the only host that may pull its value.
     */
    public function bindTo(string $submissionId, string $hostId): void
    {
        $this->cache->put($this->hostKey($submissionId), $hostId, self::KEEP_SECONDS);
    }

    /**
     * The submission's value, once, for the host its write was ordered on; a second pull, a value that is gone or
     * another host is refused.
     *
     * @throws PrivateValueRefused
     */
    public function pull(string $submissionId, string $hostId): string
    {
        if ($this->cache->pull($this->hostKey($submissionId)) !== $hostId) {
            throw PrivateValueRefused::notOrderedFor($submissionId, $hostId);
        }

        $value = $this->cache->pull($this->key($submissionId));

        if (is_string($value)) {
            return $value;
        }

        throw PrivateValueRefused::gone($submissionId);
    }

    public function discard(string $submissionId): void
    {
        $this->cache->forget($this->key($submissionId));
    }

    private function key(string $submissionId): string
    {
        return "terminal-private-value:{$submissionId}";
    }

    private function hostKey(string $submissionId): string
    {
        return "terminal-private-value-host:{$submissionId}";
    }
}
