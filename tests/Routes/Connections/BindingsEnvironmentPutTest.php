<?php

declare(strict_types=1);

namespace Tests\Routes\Connections;

use App\Projects\Commands\AssignBindingEnvironment\AssignBindingEnvironmentCommand;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner moves a connected folder's binding to another environment of its project.
 */
#[TestsRoute('PUT', 'connections.bindings.environment')]
final class BindingsEnvironmentPutTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $bindingId = strtolower((string) Str::ulid());
        $environmentId = strtolower((string) Str::ulid());

        return RouteCall::as(Caller::User)
            ->parameters([
                'binding' => $bindingId,
                'environment' => $environmentId,
            ])
            ->expects(AssignBindingEnvironmentCommand::class, [
                'bindingId' => $bindingId,
                'environmentId' => $environmentId,
            ]);
    }
}
