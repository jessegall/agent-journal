<?php

declare(strict_types=1);

namespace App\Connections\Http\Controllers;

use App\Connections\Exceptions\VerbNotServed;
use App\Connections\Values\DeviceCaller;
use App\Http\Requests\Connections\ProjectCommandRequest;
use Illuminate\Http\JsonResponse;

/**
 * A shell user's journal verb under the device grant AuthenticateDeviceGrant admitted, as the user who approved it;
 * the grant must be for the named binding. No verb is eligible for a terminal sign-in yet, so each is refused by
 * name once the caller is authenticated.
 */
final readonly class DeviceCommandController
{
    public function __invoke(ProjectCommandRequest $request, DeviceCaller $caller): JsonResponse
    {
        if ($caller->bindingId !== $request->bindingId()) {
            throw VerbNotServed::notYourBinding($request->bindingId());
        }

        throw VerbNotServed::notYetForShellUsers($request->verbName());
    }
}
