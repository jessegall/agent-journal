<?php

declare(strict_types=1);

namespace App\Sessions;

use App\Agents\Drivers\Contracts\DriverCatalogue;
use App\Agents\Drivers\Enums\DriverOperation;
use App\Agents\Values\RuntimeIntent;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Drivers\DriverRequest;
use App\Values\DriverRequestPayload;
use Illuminate\Support\Str;

/**
 * Opens a session's runtime in Starting and, when the intent carries content, its first delivery; called inside the
 * start transaction, it opens none of its own.
 */
final readonly class AgentRuntimes
{
    public function __construct(private DriverCatalogue $drivers) {}

    /**
     * @return array{0: AgentRuntime, 1: DriverRequest|null}
     */
    public function open(AgentSession $session, RuntimeIntent $intent, string $sessionToken): array
    {
        $pin = $this->drivers->pinned($intent->driver, $intent->driverType);
        $runtime = AgentRuntime::create($session, $intent, $pin);
        $runtime->begin();
        $runtime->holdStartGrant($sessionToken);

        if ($intent->firstMessage === null) {
            return [
                $runtime,
                null,
            ];
        }

        $firstRequestFields = DriverRequestPayload::text($intent->firstMessage);
        $request = DriverRequest::create($runtime, DriverOperation::Deliver, (string) Str::ulid(), $firstRequestFields);
        $request->accept();

        return [
            $runtime,
            $request,
        ];
    }
}
