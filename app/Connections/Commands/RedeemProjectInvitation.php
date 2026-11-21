<?php

declare(strict_types=1);

namespace App\Connections\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;
use App\Connections\Values\BindingFolder;
use App\Connections\Values\Redemption;

/**
 * A relay redeems an install line for its project folder, with the credential its host will sign with. It is a host
 * enrolment, so only the host control entry runs it; it is never receipted, and nothing logs its fields.
 *
 * @extends Command<Redemption>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class RedeemProjectInvitation extends Command
{
    public function __construct(
        public string $ticket,
        public string $hostCredential,
        public string $projectLabel,
        public BindingFolder $folder,
    ) {}
}
