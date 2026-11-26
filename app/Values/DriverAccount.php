<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\Sessions\TransportProfileType;
use App\Support\AccountStartRecipe;

/**
 * The saved account a driver start signs in with: the recipe its adapter checked, the journal's own MCP server the
 * start loads when it reaches the journal over MCP, the reference that names the start to the journal's relays, and
 * whether it runs under the protected-account profile.
 */
final readonly class DriverAccount
{
    public function __construct(
        public AccountStartRecipe $recipe,
        public string $startReference,
        public JournalServer|null $journalServer = null,
        public bool $isProtected = false,
        /**
         * the account's folder on the host, which a turn's Seatbelt profile keeps other workspaces' history out of
         */
        public string|null $folder = null,
    ) {}

    /**
     * Whether a turn on this account runs under its session's Seatbelt profile: one on the host with a known folder,
     * as a protected one runs in its container instead.
     */
    public function isSeatbelted(): bool
    {
        return ! $this->isProtected && $this->folder !== null;
    }

    public function loadsJournalServer(): bool
    {
        return $this->recipe->transportProfile !== TransportProfileType::Cli;
    }
}
