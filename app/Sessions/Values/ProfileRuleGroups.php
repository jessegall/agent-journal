<?php

declare(strict_types=1);

namespace App\Sessions\Values;

/**
 * The answer to which rules a profile works under: the groups that were read, or that no source of rules answered, so
 * a reader tells rules it could not read from a group known to hold none.
 */
final readonly class ProfileRuleGroups
{
    /**
     * @param  list<ProfileRuleGroup>  $groups
     */
    private function __construct(
        public array $groups,
        public bool $isRead,
    ) {}

    /**
     * @param  list<ProfileRuleGroup>  $groups
     */
    public static function read(array $groups): self
    {
        return new self($groups, true);
    }

    public static function unread(): self
    {
        return new self([], false);
    }

    public function isUnread(): bool
    {
        return ! $this->isRead;
    }
}
