<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\Navigation\NavigationRaiseOutcome;
use App\Values\LibraryEntryAnswer;

/**
 * The journal's answer to a host's raise: what came of it, the navigation request it opened, when a waiting host asks
 * again, or the library entry it replays, guarded when it was proven on another build only.
 */
final readonly class NavigationRaiseAnswer
{
    private function __construct(
        public NavigationRaiseOutcome $answer,
        public string|null $requestId = null,
        public int|null $retryAfterSeconds = null,
        public LibraryEntryAnswer|null $entry = null,
        public bool $isGuarded = false,
    ) {}

    public static function opened(string $requestId): self
    {
        return new self(NavigationRaiseOutcome::Opened, requestId: $requestId);
    }

    public static function held(): self
    {
        return new self(NavigationRaiseOutcome::Held);
    }

    public static function wait(int $retryAfterSeconds): self
    {
        return new self(NavigationRaiseOutcome::Wait, retryAfterSeconds: $retryAfterSeconds);
    }

    /**
     * An entry of the owner's library the host replays; guarded when it was proven on another build only, so the
     * host replays it with every check before it counts on it.
     */
    public static function entry(LibraryEntryAnswer $entry, bool $isGuarded): self
    {
        return new self(NavigationRaiseOutcome::Entry, entry: $entry, isGuarded: $isGuarded);
    }
}
