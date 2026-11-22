<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Exceptions\MainAgentMissing;
use App\Models\Agent;
use App\Models\MainAgentDesignation;
use App\Values\ProfileBase;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsDeskInstall;
use Tests\TestCase;

/**
 * An installation has one designated main agent, created by agents:install once; Home and admission read it only
 * through the designation.
 */
final class MainAgentInstallTest extends TestCase
{
    use CommitsHookRows;
    use RunsDeskInstall;

    private const array TABLES = [
        'main_agent_designations',
        'agents',
        'inboxes',
        'desks',
        'desk_seats',
        'desk_preferences',
        'command_receipts',
        'links',
    ];

    public function test_an_installation_without_a_designation_has_no_main_agent(): void
    {
        $this->expectException(MainAgentMissing::class);

        MainAgentDesignation::designatedAgent();
    }

    public function test_the_install_designates_one_main_agent_and_a_second_run_changes_nothing(): void
    {
        $this->installDesks();

        $this->artisan('agents:install')->assertSuccessful();
        $main = MainAgentDesignation::designatedAgent();
        $this->artisan('agents:install')->assertSuccessful();

        $this->assertSame(ProfileBase::mainAgent()->key, $main->profile_key);
        $this->assertSame($main->id, MainAgentDesignation::designatedAgent()->id);
        $this->assertSame(1, Agent::query()->withoutGlobalScopes()->count());
        $this->assertSame(1, MainAgentDesignation::query()->count());
    }
}
