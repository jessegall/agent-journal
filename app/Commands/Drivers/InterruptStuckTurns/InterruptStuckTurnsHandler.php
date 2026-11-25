<?php

declare(strict_types=1);

namespace App\Commands\Drivers\InterruptStuckTurns;

use App\Contracts\Bus\CommandHandler;
use App\Enums\DriverOperation;
use App\Enums\HoldReason;
use App\Models\Drivers\DriverRequest;
use App\Support\DriverRequests;
use App\Support\EngineAccess;
use App\Values\DriverRequestPayload;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;

final readonly class InterruptStuckTurnsHandler implements CommandHandler
{
    /**
     * The longest a turn may run before the journal interrupts it.
     */
    public const int TURN_MINUTES_LIMIT = 240;

    private const int PASS_LIMIT = 20;

    public function __construct(private EngineAccess $access, private DriverRequests $requests) {}

    /**
     * Each delivery or wake still applying past the limit gets one interrupt of its runtime, named by the request, and
     * the runtime is held as interrupted, as a user's interrupt holds it.
     */
    public function handle(InterruptStuckTurnsCommand $command): void
    {
        $this->access->assertMaintenanceGranted(InterruptStuckTurnsCommand::MAINTENANCE_SCOPE);

        $stuck = DriverRequest::query()
            ->with('runtime.session')
            ->turnsApplyingSince(CarbonImmutable::now()->subMinutes(self::TURN_MINUTES_LIMIT))
            ->byUpdatedAt()
            ->limit(self::PASS_LIMIT)
            ->get();

        foreach ($stuck as $request) {
            $target = new StackTarget($request->runtime->session->agent_id, $request->runtime->agent_session_id);

            $this->requests->append(
                $target,
                DriverOperation::Interrupt,
                "stuck-turn-{$request->id}",
                DriverRequestPayload::nothing(),
            );

            $this->requests->holdRuntime($target, HoldReason::Interrupted);
        }
    }
}
