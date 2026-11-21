<?php

declare(strict_types=1);

namespace App\Connections\Http\Controllers;

use App\Connections\Exceptions\VerbNotServed;
use App\Connections\Support\DeviceOverviews;
use App\Connections\Values\DeviceCaller;
use App\Connections\Values\EnvironmentTask;
use App\Http\Requests\Connections\ProjectCommandRequest;
use Illuminate\Http\JsonResponse;

/**
 * A shell user's journal verb under the device grant AuthenticateDeviceGrant admitted, as the user who approved it;
 * the grant must be for the named binding. The one verb a terminal sign-in runs is the one-word overview; every other
 * verb, an overview with more words included, is refused by name.
 */
final readonly class DeviceCommandController
{
    public function __invoke(
        ProjectCommandRequest $request,
        DeviceCaller $caller,
        DeviceOverviews $overviews,
    ): JsonResponse {
        if ($caller->bindingId !== $request->bindingId()) {
            throw VerbNotServed::notYourBinding($request->bindingId());
        }

        if (! $request->isOverview()) {
            throw VerbNotServed::providerSessionOnly($request->verbName());
        }

        $overview = $overviews->of($caller);

        return new JsonResponse([
            'project' => $overview->projectLabel,
            'environment' => $overview->environmentLabel,
            'count' => $overview->tasks->count,
            'tasks' => array_map(
                fn (EnvironmentTask $task) => ['number' => $task->number, 'title' => $task->title],
                $overview->tasks->tasks,
            ),
        ], JsonResponse::HTTP_OK, ['Cache-Control' => 'no-store, private']);
    }
}
