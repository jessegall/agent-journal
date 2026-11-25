<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Commands\Profiles\ActivateProfiles\ActivateProfilesCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Sessions\ProfileRules;
use App\Models\Access\User;
use App\Models\Profiles\Profile;
use App\Support\Access\AccessSettings;
use App\Support\ProfileProposal;
use App\Support\UnreadProfileRules;
use App\Values\ProfileBase;
use App\Values\ProfileKey;
use Domain\Rules\Support\ProfileRuleRecords;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

/**
 * A profile carries the sentence that describes it from its proposal to its row, the profiles page shows it with the
 * profile's program and rules, and the rules a profile works under tell unread from a known empty group.
 */
final class ProfileDescriptionTest extends TestCase
{
    use RefreshHookDatabase;
    use StartsAgentRequests;

    private const string DESCRIPTION = 'Reads every change and says what is wrong with it.';

    private User $owner;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
    }

    public function test_a_proposed_description_reaches_the_row_and_a_profile_without_one_keeps_it_empty(): void
    {
        $this->activate();

        $this->assertSame(self::DESCRIPTION, Profile::byKey(ProfileKey::from('reviewer'))->description);
        $this->assertSame('', Profile::byKey(ProfileKey::from('worker'))->description);
    }

    public function test_every_built_in_profile_has_a_description(): void
    {
        foreach (ProfileBase::all() as $base) {
            $this->assertNotSame('', $base->description, $base->key);
        }
    }

    public function test_the_page_lists_the_description_and_the_reader_shows_program_and_rules(): void
    {
        $this->activate();

        $index = $this->pageOf('/accounts/profiles');
        $reader = $this->pageOf('/accounts/profiles/reviewer');

        $this->assertStringContainsString(self::DESCRIPTION, $index);
        $this->assertStringContainsString(ProfileBase::readOnlyHelper()->label, $reader);
        $this->assertStringContainsString(ProfileRuleRecords::GROUP_LABEL, $reader);
    }

    public function test_the_reader_keeps_the_rules_in_a_group_of_their_own_and_the_rows_show_no_state(): void
    {
        $this->activate();

        $index = $this->pageOf('/accounts/profiles');
        $reader = $this->pageOf('/accounts/profiles/reviewer');

        $this->assertStringContainsString('"key":"profile"', $reader);
        $this->assertStringContainsString('"key":"rules"', $reader);
        $this->assertStringNotContainsString('"key":"state"', $index);
    }

    public function test_rules_with_no_domain_to_read_them_are_unread_and_the_rules_domain_answers_a_known_group(): void
    {
        $key = ProfileKey::from('reviewer');

        $this->assertTrue(new UnreadProfileRules()->of($key)->isUnread());

        $groups = $this->app->make(ProfileRules::class)->of($key);

        $this->assertFalse($groups->isUnread());
        $this->assertSame([ProfileRuleRecords::GROUP_LABEL], array_column($groups->groups, 'label'));
    }

    private function activate(): void
    {
        $this->startUserRequestAs($this->owner->id);
        $this->app->make(CommandBus::class)->run(new ActivateProfilesCommand(ProfileProposal::fromConfiguration([
            'revision' => 1,
            'base_overrides' => [],
            'profiles' => [
                'reviewer' => [
                    'base' => 'read-only-helper',
                    'tier' => 2,
                    'description' => self::DESCRIPTION,
                    'supervisor' => ['default' => 'owner'],
                ],
                'worker' => [
                    'base' => 'writing-helper',
                    'tier' => 2,
                    'supervisor' => ['default' => 'owner'],
                ],
            ],
        ])));
    }

    private function pageOf(string $address): string
    {
        $page = $this->actingAs($this->owner)->get($address)->assertOk()->viewData('page');

        return (string) json_encode($page, JSON_UNESCAPED_SLASHES);
    }
}
