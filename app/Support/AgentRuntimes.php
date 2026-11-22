<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\DriverCatalogue;
use App\Enums\DriverOperation;
use App\Models\AgentRuntime;
use App\Models\AgentSession;
use App\Models\DriverRequest;
use App\Values\DriverRequestPayload;
use App\Values\RuntimeIntent;
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
    public function open(AgentSession $session, RuntimeIntent $intent, string $startToken): array
    {
        $pin = $this->drivers->pinned($intent->driver, $intent->variant);
        $runtime = AgentRuntime::create($session, $intent, $pin);
        $runtime->begin();
        $runtime->holdStartGrant($startToken);

        if ($intent->firstMessage === null) {
            return [$runtime, null];
        }

        $firstRequestFields = DriverRequestPayload::message($intent->firstMessage);
        $request = DriverRequest::create($runtime, DriverOperation::Deliver, (string) Str::ulid(), $firstRequestFields);
        $request->accept();

        return [$runtime, $request];
    }
}
