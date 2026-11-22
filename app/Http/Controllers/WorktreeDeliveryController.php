<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Commands\SubmitWorktreeDelivery\SubmitWorktreeDeliveryCommand;
use App\Contracts\Bus\CommandBus;
use App\Values\DeliverySubmission;
use App\Values\HostContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * A child's relay submits its broker-verified commit; the receipt means submitted for integration.
 */
final readonly class WorktreeDeliveryController
{
    public function __invoke(Request $request, HostContext $host, CommandBus $commands): JsonResponse
    {
        $submission = new DeliverySubmission(
            $request->string('deliveryId')->toString(),
            $request->string('claim')->toString(),
            $request->integer('generation'),
            $request->string('checkout')->toString(),
            $request->string('tip')->toString(),
            $request->string('targetRef')->toString(),
            $request->string('expectedTarget')->toString(),
        );

        $receipt = $commands->run(new SubmitWorktreeDeliveryCommand($host->hostId, $submission));

        return new JsonResponse([
            'deliveryId' => $receipt->id,
            'tip' => $receipt->deliveredTip,
            'outcome' => $receipt->outcome,
        ], JsonResponse::HTTP_OK);
    }
}
