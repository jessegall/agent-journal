<?php

declare(strict_types=1);

namespace App\Commands\Agents\DeliverAgent;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Drivers\AttachmentReferences;
use App\Data\Messages\MessageAttachmentData;
use App\Enums\DriverOperation;
use App\Exceptions\DriverRequestRefused;
use App\Support\DriverBudgets;
use App\Support\DriverRequests;
use App\Values\DriverReceipt;
use App\Values\DriverRequestPayload;

final readonly class DeliverAgentHandler implements CommandHandler
{
    public function __construct(
        private DriverRequests $requests,
        private DriverBudgets $budgets,
        private AttachmentReferences $attachments,
    ) {}

    /**
     * Every part is checked before any is accepted: a delivery with one part that cannot go is refused whole.
     */
    public function handle(DeliverAgentCommand $command): DriverReceipt
    {
        if ($command->parts === []) {
            throw DriverRequestRefused::noParts();
        }

        if (! $this->budgets->fitsDelivery($command->textBytes())) {
            throw DriverRequestRefused::messageTooLarge($command->textBytes(), $this->budgets->deliverMaxBytes);
        }

        foreach ($command->parts as $part) {
            if ($part instanceof MessageAttachmentData) {
                $this->attachments->assertReadable($part, $command->sessionId);
            }
        }

        return $this->requests->append(
            $command->target(),
            DriverOperation::Deliver,
            $command->idempotencyKey,
            DriverRequestPayload::parts($command->parts),
        )->receipt;
    }
}
