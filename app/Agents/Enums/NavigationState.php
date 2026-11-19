<?php

declare(strict_types=1);

namespace App\Agents\Enums;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Where a navigation request stands: open until the main agent answers, answering while it sends rounds, proving
 * while the host looks for its proof, and then one of its ends (doc 54, section 5).
 */
#[TypeScript]
enum NavigationState: string
{
    case Open = 'open';
    case Answering = 'answering';
    case Proving = 'proving';
    case Proven = 'proven';
    case Abandoned = 'abandoned';
    case Interrupted = 'interrupted';
    case Cancelled = 'cancelled';
    case Expired = 'expired';

    /**
     * The states a request may still move out of; one request per runtime is in one of them at a time.
     *
     * @return list<self>
     */
    public static function openStates(): array
    {
        return [self::Open, self::Answering, self::Proving];
    }

    public function isOpen(): bool
    {
        return in_array($this, self::openStates(), true);
    }

    /**
     * Whether the state table lets a request in this state move to the other.
     */
    public function canMoveTo(self $next): bool
    {
        return in_array($next, $this->nextStates(), true);
    }

    /**
     * @return list<self>
     */
    private function nextStates(): array
    {
        return match ($this) {
            self::Open => [self::Answering, self::Cancelled, self::Expired, self::Interrupted],
            self::Answering => [self::Proving, self::Abandoned, self::Cancelled, self::Expired, self::Interrupted],
            self::Proving => [self::Proven, self::Answering, self::Cancelled],
            self::Proven, self::Abandoned, self::Interrupted, self::Cancelled, self::Expired => [],
        };
    }
}
