<?php

declare(strict_types=1);

namespace Domain\Rules\Tests\Routes;

use Domain\Rules\Commands\DenyRule\DenyRuleCommand;
use Domain\Rules\Commands\ProposeRule\ProposeRuleCommand;
use Domain\Rules\Models\Rule;
use Domain\Rules\RulesDomain;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\TestProjects;

/**
 * The owner denies a rule an agent proposed.
 */
#[TestsRoute('PATCH', 'rules.deny')]
final class DenyPatchTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(RulesDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()->signedStart('Planner');

        $ruleId = $journal->runAsStart(
            $start,
            new ProposeRuleCommand('No phase waits on the user.', 'Agents keep forgetting it.', TestProjects::local()->id),
        );

        $journal->actAs('Owner');

        return RouteCall::as(Caller::User)
            ->parameters([
                'rule' => Rule::query()->findOrFail($ruleId)->number,
            ])
            ->expects(DenyRuleCommand::class, [
                'ruleId' => $ruleId,
            ]);
    }
}
