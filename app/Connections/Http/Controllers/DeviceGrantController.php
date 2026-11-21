<?php

declare(strict_types=1);

namespace App\Connections\Http\Controllers;

use App\Agents\Contracts\HostCalls;
use App\Agents\Enums\HostProtocolVersion;
use App\Agents\Support\ServerOrigin;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\EntryDispatchers;
use App\Connections\Commands\PollDeviceGrant;
use App\Connections\Commands\StartDeviceGrant;
use App\Connections\Models\DeviceGrant;
use App\Connections\Values\InstallTicket;
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

    public function start(Request $request, EntryDispatchers $dispatchers): JsonResponse
    {
        $host = $this->calls->verify($request, HostProtocolVersion::RemoteProject);
        $deviceCode = InstallTicket::generate();
        $userCode = implode('-', str_split(Str::upper(Str::random(8)), 4));
        $binding = $request->string('binding')->toString();
        $start = new StartDeviceGrant($host->hostId, $binding, $deviceCode->digest(), $userCode);
        $started = $dispatchers->runAsJournal(CommandEntry::HostControl, 'device grant', $start);

        return new JsonResponse([
            'deviceCode' => $deviceCode->secret,
            'userCode' => $started->userCode,
            'approvalUrl' => $this->origin->canonical().'/connections/devices/'.$started->userCode,
            'expiresAt' => $started->expiresAt,
            'interval' => DeviceGrant::POLL_SECONDS,
        ], JsonResponse::HTTP_CREATED, ['Cache-Control' => 'no-store']);
    }

    public function poll(Request $request, EntryDispatchers $dispatchers): JsonResponse
    {
        $host = $this->calls->verify($request, HostProtocolVersion::RemoteProject);
        $grant = InstallTicket::generate();
        $deviceCode = InstallTicket::digestOf($request->string('deviceCode')->toString());
        $poll = new PollDeviceGrant($host->hostId, $deviceCode, $grant->digest());
        $dispatchers->runAsJournal(CommandEntry::HostControl, 'device grant', $poll);

        return new JsonResponse(['grant' => $grant->secret], JsonResponse::HTTP_OK, ['Cache-Control' => 'no-store']);
    }
}
