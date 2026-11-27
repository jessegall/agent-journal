<?php

declare(strict_types=1);

namespace App\Http\Middleware\Profiles;

use App\Hosts\ArrangementSetting;
use App\Hosts\Exceptions\RunnerArrangementRefused;
use App\Projects\Enums\ArrangementType;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Refuses a sign-in, check or cleanup claim from a sign-in runner of the other arrangement before anything is
 * claimed, so one journal never runs both runners. A runner that names none, as the Mac's
 * bin/journal-account, is a local one.
 */
final readonly class RefuseRunnerOfOtherArrangement
{
    public function __construct(private ArrangementSetting $setting) {}

    /**
     * @throws RunnerArrangementRefused
     */
    public function handle(Request $request, Closure $next): Response
    {
        $runner = $request->enum('arrangement', ArrangementType::class, ArrangementType::Local);
        $this->setting->assertRunnerFits($runner);

        return $next($request);
    }
}
