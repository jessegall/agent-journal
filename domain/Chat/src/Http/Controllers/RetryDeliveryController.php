<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Communication\Commands\RetryDelivery;
use Domain\Chat\Data\RetryDeliveryInput;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class RetryDeliveryController
{
    /**
     * Asks again for one recipient's given-up delivery under its own key; the post and the other recipients stay as
     * they are, and the command refuses anyone but an operator.
     */
    public function __invoke(RetryDeliveryInput $input, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new RetryDelivery($input->rangeId));

        return $redirect->back(303);
    }
}
