<?php

declare(strict_types=1);

namespace App\Hooks\Listeners;

use App\Contracts\Listener;
use App\Hooks\Events\LifecycleAnswersSettled;
use App\Hooks\Settlement\LifecycleEffects;

/**
 * Runs the commands of a settled stack change once it committed.
 */
final readonly class RunLifecycleAnswers implements Listener
{
    public function __construct(private LifecycleEffects $effects) {}

    public function handle(LifecycleAnswersSettled $settled): void
    {
        $this->effects->apply($settled->answers, $settled->actor, $settled->authority);
    }
}
