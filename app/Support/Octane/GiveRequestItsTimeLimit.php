<?php

declare(strict_types=1);

namespace App\Support\Octane;

use Illuminate\Contracts\Foundation\Application;

/**
 * Gives each request the whole time limit from its own start: a FrankenPHP worker sets the limit once when it starts,
 * so its clock runs across the requests it serves and a long poll late in its life is stopped early.
 */
final readonly class GiveRequestItsTimeLimit
{
    /**
     * @param  object{sandbox: Application}  $event
     */
    public function handle(object $event): void
    {
        set_time_limit($event->sandbox->make('config')->integer('octane.max_execution_time'));
    }
}
