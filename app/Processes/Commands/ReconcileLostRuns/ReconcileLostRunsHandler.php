<?php

declare(strict_types=1);

namespace App\Processes\Commands\ReconcileLostRuns;

use App\Bus\Contracts\CommandHandler;
use App\Processes\RunReconciler;

final readonly class ReconcileLostRunsHandler implements CommandHandler
{
    public function __construct(private RunReconciler $reconciler) {}

    public function handle(ReconcileLostRunsCommand $command): int
    {
        return $this->reconciler->reconcile();
    }
}
