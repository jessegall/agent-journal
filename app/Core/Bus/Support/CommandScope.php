<?php

declare(strict_types=1);

namespace App\Core\Bus\Support;

use App\Core\Bus\Enums\CommandScopeType;

/**
 * The commands a middleware acts on.
 */
final readonly class CommandScope
{
    private function __construct(
        public CommandScopeType $type,
        public string $target,
    ) {}

    public static function all(): self
    {
        return new self(CommandScopeType::All, '');
    }

    /**
     * @param  class-string  $command
     */
    public static function command(string $command): self
    {
        return new self(CommandScopeType::Command, $command);
    }

    /**
     * @param  class-string  $domain  the owner's Domain class
     */
    public static function ownedBy(string $domain): self
    {
        return new self(CommandScopeType::Owner, $domain);
    }

    public static function ownedByCore(): self
    {
        return new self(CommandScopeType::Owner, CommandOwner::CORE);
    }
}
