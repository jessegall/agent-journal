<?php

declare(strict_types=1);

namespace App\Projects\Commands\RedeemProjectInvitation;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Projects\Values\BindingFolder;
use App\Projects\Values\Redemption;
use App\Support\Command;

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
