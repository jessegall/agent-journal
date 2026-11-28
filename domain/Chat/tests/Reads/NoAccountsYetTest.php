<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Reads;

use App\Accounts\NoAccountsYet;
use App\Support\Layout\LayoutActionData;
use App\Support\Layout\LayoutPartData;
use Domain\Chat\Data\ChatData;
use Domain\Chat\Http\Pages\ChatPageBuilder;
use Domain\Chat\Tests\TestCase;
use Illuminate\Http\Request;
use Spatie\LaravelData\Optional;
use Tests\Support\RefreshHookDatabase;

/**
 * Home's chat shows the No accounts yet state, with its action to the account wizard, while no account is signed in,
 * and shows none once one is.
 */
final class NoAccountsYetTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_the_chat_shows_no_accounts_yet_with_the_wizard_while_no_account_is_signed_in(): void
    {
        $this->journal->owner()->idleAgent('Planner');

        $empty = $this->window()->noAccounts;

        $this->assertInstanceOf(LayoutPartData::class, $empty);
        $notice = $empty->children[1];
        $action = $empty->children[2];
        $this->assertSame(
            [NoAccountsYet::TITLE, NoAccountsYet::SENTENCE, 'Add account'],
            [$notice->text, $notice->detail, $action->text],
        );
        $this->assertEquals(LayoutActionData::build()->href('/accounts?add=1')->finish(), $action->action);
    }

    public function test_the_chat_shows_no_such_state_once_an_account_is_signed_in(): void
    {
        $this->journal->owner()->chooseActiveAccounts()->idleAgent('Planner');

        $this->assertInstanceOf(Optional::class, $this->window()->noAccounts);
    }

    private function window(): ChatData
    {
        $visit = Request::create('/');

        return $this->app->make(ChatPageBuilder::class)->build($visit);
    }
}
