<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Attributes\Bus\Dispatches;
use App\Commands\Projects\PollDeviceGrant\PollDeviceGrantCommand;
use App\Commands\Projects\StartDeviceGrant\StartDeviceGrantCommand;
use App\Contracts\Hosts\HostCalls;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Engine\RefusalCode;
use App\Models\Projects\DeviceGrant;
use App\Support\JournalCommands;
use App\Support\ServerOrigin;
use App\Values\InstallTicket;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

/**
 * The shell side of device approval, signed by the binding's host: start answers the device code, the user code and
 * the HTTPS approval URL the owner opens; poll answers the grant once the owner approved it. Only digests are kept.
 * The dispatchers come per action: they hold the request's command entrance, which a kept controller must not.
 */
final readonly class DeviceGrantController
{
    public function __construct(private HostCalls $calls, private ServerOrigin $origin) {}

    #[Dispatches(StartDeviceGrantCommand::class)]
    public function start(Request $request, JournalCommands $dispatchers): JsonResponse
    {
        $host = $this->calls->verifyRelay($request);
        $deviceCode = InstallTicket::generate();
        $userCode = implode('-', str_split(Str::upper(Str::random(8)), 4));
        $binding = $request->string('binding')->toString();
        $startKey = $request->filled('startKey') ? $request->string('startKey')->toString() : (string) Str::uuid();
        $start = new StartDeviceGrantCommand($host->hostId, $binding, $deviceCode->digest(), $userCode, $startKey);
        $started = $dispatchers->runAsJournal(CommandEntry::HostControl, 'device grant', $start);

        return new JsonResponse([
            'reference' => $started->reference,
            'generation' => $started->generation,
            'deviceCode' => $deviceCode->secret,
            'userCode' => $started->userCode,
            'approvalUrl' => $this->origin->canonical().'/connections/devices/'.$started->userCode,
            'expiresAt' => $started->expiresAt,
            'interval' => DeviceGrant::POLL_SECONDS_MINIMUM,
        ], JsonResponse::HTTP_CREATED, ['Cache-Control' => 'no-store']);
    }

    #[Dispatches(PollDeviceGrantCommand::class)]
    public function poll(Request $request, JournalCommands $dispatchers): JsonResponse
    {
        $host = $this->calls->verifyRelay($request);
        $grant = InstallTicket::generate();
        $deviceCode = InstallTicket::digestOf($request->string('deviceCode')->toString());
        $poll = new PollDeviceGrantCommand($host->hostId, $deviceCode, $grant->digest());
        $polled = $dispatchers->runAsJournal(CommandEntry::HostControl, 'device grant', $poll);

        if ($polled->isPending()) {
            return new JsonResponse([
                'code' => RefusalCode::StateBlocked->value,
                'message' => 'The owner has not approved this device yet.',
                'details' => ['outcome' => $polled->outcome, 'reference' => $polled->reference],
            ], JsonResponse::HTTP_PRECONDITION_REQUIRED, ['Cache-Control' => 'no-store']);
        }

        return new JsonResponse(
            ['outcome' => $polled->outcome, 'grant' => $grant->secret, 'reference' => $polled->reference],
            JsonResponse::HTTP_OK,
            ['Cache-Control' => 'no-store'],
        );
    }
}
