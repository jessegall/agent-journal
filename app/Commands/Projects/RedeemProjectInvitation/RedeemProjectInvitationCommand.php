<?php

declare(strict_types=1);

namespace App\Commands\Projects\RedeemProjectInvitation;

use App\Attributes\Entry;
use App\Enums\CommandEntry;
use App\Support\Command;
use App\Values\BindingFolder;
use App\Values\Redemption;

/**
 * A relay redeems an install line for its project folder, with the credential its host will sign with. It is a host
 * enrolment, so only the host control entry runs it; it is never receipted, and nothing logs its fields.
 *
 * @extends Command<Redemption>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class RedeemProjectInvitationCommand extends Command
{
    public function __construct(
        public string $ticket,
        public string $hostCredential,
        public string $projectLabel,
        public BindingFolder $folder,
    ) {}
}
