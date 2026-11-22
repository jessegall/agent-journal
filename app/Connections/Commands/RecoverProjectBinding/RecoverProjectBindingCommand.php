<?php

declare(strict_types=1);

namespace App\Connections\Commands\RecoverProjectBinding;

use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;
use App\Connections\Values\Redemption;

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
