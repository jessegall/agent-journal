<?php

declare(strict_types=1);

namespace App\Values;

use App\Accounts\AccountStartRecipe;
use App\Agents\Values\JournalServer;
use App\Sessions\Enums\TransportProfileType;

/**
 * The saved account a driver start signs in with: the recipe its adapter checked, the journal's own MCP server the
 * start loads when it reaches the journal over MCP, the reference that names the start to the journal's relays, and
 * the account's folder.
 */
final readonly class DriverAccount
{
    public function __construct(
        public AccountStartRecipe $recipe,
        public string $startReference,
        public JournalServer|null $journalServer = null,
        /**
         * the account's folder on the host
         */
        public string|null $folder = null,
    ) {}

    public function loadsJournalServer(): bool
    {
        return $this->recipe->transportProfile !== TransportProfileType::Cli;
    }
}
