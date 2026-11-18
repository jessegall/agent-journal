<?php

declare(strict_types=1);

namespace App\Processes\Handlers;

use App\Contracts\CommandHandler;
use App\Processes\Commands\ReconcileLostRuns;
use App\Processes\Support\RunReconciler;

final readonly class ReconcileLostRunsHandler implements CommandHandler
{
    public function __construct(private RunReconciler $reconciler) {}

    public function handle(ReconcileLostRuns $command): int
    {
        return $this->reconciler->reconcile();
    }
}
