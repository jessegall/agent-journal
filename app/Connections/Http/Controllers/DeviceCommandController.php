<?php

declare(strict_types=1);

namespace App\Connections\Http\Controllers;

use App\Connections\Exceptions\VerbNotServed;
use App\Connections\Models\DeviceGrant;
use App\Connections\Values\InstallTicket;
use App\Http\Requests\Connections\ProjectCommandRequest;
use Illuminate\Http\JsonResponse;

/**
 * A shell user's journal verb under a device grant: the grant must be issued, unexpired and for the named binding.
 * Running a verb as a user needs a user-call path the journal's console clients do not have yet, so the verb is
 * refused by name once the grant is admitted.
 */
final readonly class DeviceCommandController
{
    public function __invoke(ProjectCommandRequest $request): JsonResponse
    {
        $grant = DeviceGrant::usable(InstallTicket::digestOf((string) $request->bearerToken()));

        if ($grant->binding_id !== $request->bindingId()) {
            throw VerbNotServed::notYourBinding($request->bindingId());
        }

        throw VerbNotServed::notYetForShellUsers($request->verbName());
    }
}
