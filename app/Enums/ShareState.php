<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Where a share stands: proposed by an agent, waiting for its gateway, readable, failed to open, or ended.
 */
enum ShareState: string
{
    case Proposed = 'proposed';
    case Pending = 'pending';
    case Active = 'active';
    case Failed = 'failed';
    case Revoked = 'revoked';
    case Expired = 'expired';

    /**
     * Whether the share holds an owner's grant and counts against the installation's limit while unexpired.
     */
    public function isLive(): bool
    {
        return match ($this) {
            self::Pending, self::Active, self::Failed => true,
            self::Proposed, self::Revoked, self::Expired => false,
        };
    }

    /**
     * The states of a share that holds an owner's grant.
     *
     * @return list<self>
     */
    public static function liveStates(): array
    {
        return array_values(array_filter(self::cases(), fn (self $state) => $state->isLive()));
    }

    /**
     * Whether the share has ended for good, so no command brings it back.
     */
    public function isTerminal(): bool
    {
        return match ($this) {
            self::Revoked, self::Expired => true,
            self::Proposed, self::Pending, self::Active, self::Failed => false,
        };
    }

    /**
     * Whether the owner may retry opening the share on its gateway, keeping its deadline.
     */
    public function mayRetry(): bool
    {
        return match ($this) {
            self::Pending, self::Failed => true,
            self::Proposed, self::Active, self::Revoked, self::Expired => false,
        };
    }
}
