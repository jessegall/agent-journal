<?php

declare(strict_types=1);

namespace App\Commands\Agents\SubmitWorktreeDelivery;

use App\Attributes\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;
use App\Values\DeliveryReceipt;
use App\Values\DeliverySubmission;

/**
 * A child's relay submits its broker-verified commit for integration; only the host of the claim's binding may.
 *
 * @extends Command<DeliveryReceipt>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class SubmitWorktreeDeliveryCommand extends Command
{
    public function __construct(public string $hostId, public DeliverySubmission $submission) {}
}
