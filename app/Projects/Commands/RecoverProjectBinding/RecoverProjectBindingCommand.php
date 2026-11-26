<?php

declare(strict_types=1);

namespace App\Projects\Commands\RecoverProjectBinding;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Projects\Values\Redemption;
use App\Support\Command;

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
