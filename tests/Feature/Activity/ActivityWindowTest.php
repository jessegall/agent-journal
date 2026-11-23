<?php

declare(strict_types=1);

namespace Tests\Feature\Activity;

use App\Enums\ActivityType;
use App\Enums\ActorType;
use App\Models\Agents\ActivityEntry;
use App\Models\Agents\Agent;
use App\Support\ActorIdentity;
use Carbon\CarbonImmutable;
use Closure;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Inertia\Testing\AssertableInertia;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

/**
 * The owner's Activity window on Home: the newest entries of the journal's agents oldest first with each agent's
 * name, older pages on request, and nothing for anyone else.
 */
final class ActivityWindowTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['activity_entries', 'agents', 'users', 'settings_records'];

    private const string PROP = 'window_web_activity';

    private User $owner;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
    }

    public function test_an_empty_journal_has_no_events(): void
    {
        $this->window([], fn (AssertableInertia $window) => $window
            ->where(self::PROP.'.data.events', [])
            ->where(self::PROP.'.data.hasOlder', false));
    }

    public function test_the_newest_page_is_sent_oldest_first_and_before_reads_the_page_older_than_it(): void
    {
        $agent = Agent::create('Builder', 'main-agent');
        $actor = new ActorIdentity(ActorType::Agent, $agent->id);
        $entries = [];

        for ($minute = 0; $minute <= ActivityEntry::READ_ENTRY_LIMIT; $minute++) {
            CarbonImmutable::setTestNow(CarbonImmutable::parse('2026-11-23 09:00')->addMinutes($minute));
            $entries[] = ActivityEntry::create($actor, ActivityType::Ran, "step {$minute}", null);
        }

        $this->window([], fn (AssertableInertia $window) => $window
            ->count(self::PROP.'.data.events', ActivityEntry::READ_ENTRY_LIMIT)
            ->where(self::PROP.'.data.events.0.text', 'Ran step 1')
            ->where(self::PROP.'.data.events.0.who', 'Builder')
            ->where(self::PROP.'.data.events.0.level', ActivityType::Ran->defaultLevel()->value)
            ->where(self::PROP.'.data.events.0.icon', ActivityType::Ran->icon())
            ->where(self::PROP.'.data.hasOlder', true));

        $this->window(['before' => $entries[1]->id], fn (AssertableInertia $window) => $window
            ->count(self::PROP.'.data.events', 1)
            ->where(self::PROP.'.data.events.0.text', 'Ran step 0')
            ->where(self::PROP.'.data.hasOlder', false));
    }

    public function test_someone_other_than_the_owner_does_not_see_the_window(): void
    {
        $this->actingAs(User::factory()->create())->get('/?window[web.activity][before]=')->assertForbidden();
    }

    /**
     * @param  array<string, string>  $query
     * @param  Closure(AssertableInertia): AssertableInertia  $assertions
     */
    private function window(array $query, Closure $assertions): void
    {
        $address = '/?'.http_build_query(['window' => ['web.activity' => $query === [] ? ['before' => ''] : $query]]);

        $this->actingAs($this->owner)->get($address)->assertOk()->assertInertia(
            fn (AssertableInertia $page) => $page->reloadOnly([self::PROP], $assertions),
        );
    }
}
