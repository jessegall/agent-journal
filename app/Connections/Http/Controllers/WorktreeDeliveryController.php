<?php

declare(strict_types=1);

namespace App\Connections\Http\Controllers;

use App\Agents\Values\HostContext;
use App\Bus\Contracts\CommandBus;
use App\Connections\Commands\SubmitWorktreeDelivery;
use App\Connections\Values\DeliverySubmission;
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
        $receipt = $commands->run(new SubmitWorktreeDelivery($host->hostId, $submission));

        return new JsonResponse([
            'deliveryId' => $receipt->deliveryId,
            'tip' => $receipt->deliveredTip,
            'outcome' => $receipt->outcome,
        ], JsonResponse::HTTP_OK);
    }
}
