<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\CommandMiddleware;

use App\Bus\Contracts\CommandMiddleware;
use App\Bus\Exceptions\CommandRefused;
use App\Bus\Support\CommandCall;
use Closure;
use Tests\Fixtures\Modules\Notes\Support\CommandTrail;

/**
 * A quota a module puts on another owner's exported command: refuses StartPlan before it runs (doc 19, section 7.6).
 */
final readonly class LimitPlanStarts implements CommandMiddleware
{
    public function __construct(private CommandTrail $trail) {}

    public function handle(CommandCall $call, Closure $next): mixed
    {
        $this->trail->add('notes limits plan starts');

        throw CommandRefused::because('This journal has started all the plans its quota allows today.');
    }
}
