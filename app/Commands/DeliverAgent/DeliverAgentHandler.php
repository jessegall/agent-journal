<?php

declare(strict_types=1);

namespace App\Commands\DeliverAgent;

use App\Contracts\CommandHandler;
use App\Enums\DriverOperation;
use App\Exceptions\DriverRequestRefused;
use App\Support\DriverBudgets;
use App\Support\DriverRequests;
use App\Values\DriverReceipt;
use App\Values\DriverRequestPayload;

final readonly class DeliverAgentHandler implements CommandHandler
{
    public function __construct(private DriverRequests $requests, private DriverBudgets $budgets) {}

    public function handle(DeliverAgentCommand $command): DriverReceipt
    {
        if (! $this->budgets->fitsDelivery($command->message)) {
            throw DriverRequestRefused::messageTooLarge(strlen($command->message), $this->budgets->deliverMaxBytes);
        }

        return $this->requests->append(
            $command->target(),
            DriverOperation::Deliver,
            $command->idempotencyKey,
            DriverRequestPayload::message($command->message),
        )->receipt();
    }
}
