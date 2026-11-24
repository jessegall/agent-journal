<?php

declare(strict_types=1);

namespace App\Support;

use App\Commands\Asks\AdvanceAsk\AdvanceAskCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Events\EngineListener;
use App\Contracts\Time\ServerClock;
use App\Events\Engine\EngineTicked;
use Throwable;

/**
 * Advances at most five due asks on every engine pass, each as its own command. This is the one boundary where an ask
 * that cannot advance is reported and skipped, so it never holds back the asks due after it; the next pass weighs it
 * again.
 */
final readonly class AdvanceDueAsksOnTick implements EngineListener
{
    /**
     * The most asks one pass advances.
     */
    private const int PASS_LIMIT = 5;

    public function __construct(
        private CommandBus $commands,
        private AskClock $asks,
        private ServerClock $clock,
    ) {}

    public function maintenanceScope(): string
    {
        return AdvanceAskCommand::MAINTENANCE_SCOPE;
    }

    public function __invoke(EngineTicked $event): void
    {
        $now = $this->clock->now();

        foreach ($this->asks->dueHops($now, self::PASS_LIMIT) as $hop) {
            try {
                $this->commands->run(new AdvanceAskCommand($hop->ask_id));
            } catch (Throwable $failure) {
                report($failure);
            }
        }
    }
}
