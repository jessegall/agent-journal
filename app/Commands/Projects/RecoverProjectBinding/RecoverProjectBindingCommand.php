<?php

declare(strict_types=1);

namespace App\Commands\Projects\RecoverProjectBinding;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;
use App\Values\Redemption;

/**
 * An authenticated host asks for the binding its installation nonce made, after the reply to its redemption was lost.
 *
 * @extends Command<Redemption>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class RecoverProjectBindingCommand extends Command
{
    public function __construct(public string $hostId, public string $installationNonce) {}
}
